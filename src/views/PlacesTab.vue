<template>
  <div class="places-filters">
    <CustomSelect
      v-model="selectedParkId"
      :options="parkOptions"
      @update:modelValue="loadRoutes"
    />
    <CustomSelect
      v-model="selectedRouteId"
      :options="routeOptions"
      @update:modelValue="loadPlaces"
    />
  </div>

  <div v-if="places.length" class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Описание</th>
          <th>Категория</th>
          <th>Площадь (кв. м)</th>
          <th>Площадь на посетителя (кв. м)</th>
          <th>Коэффициент возвращения</th>
          <th>Дни</th>
          <th>Используется в расчетах</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="place in places" :key="place.id" @click="editPlace(place)">
          <td>{{ place.name }}</td>
          <td><TruncatedTextCell :text="place.description" /></td>
          <td><img :src="place.icon" alt="нет иконки" class="place-icon" /></td>
          <td>{{ place.used_in_calculations ? place.area : "-" }}</td>
          <td>
            {{ place.used_in_calculations ? place.area_per_visitor : "-" }}
          </td>
          <td>
            {{ place.used_in_calculations ? place.return_coefficient : "-" }}
          </td>
          <td>{{ place.used_in_calculations ? place.days : "-" }}</td>
          <td>{{ place.used_in_calculations ? "Да" : "Нет" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <p>Нет мест для выбранного маршрута.</p>
  </div>

  <Button class="places-tab-button" @click="openAddPlaceModal">
    Добавить новое место
  </Button>

  <PlaceFormModal
    v-if="showPlaceFormModal"
    :place="selectedPlace"
    :route-id="selectedRouteId"
    :route="route"
    @close="closePlaceFormModal"
    @submit="handlePlaceFormSubmit"
  />
  <Pagination
    :page="page"
    :totalPages="totalPages"
    @prev-page="prevPage"
    @next-page="nextPage"
    @set-page="setPage"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { fetchRoutesByParkId, fetchParks } from "@/api/routes";
import { fetchPlacesByRouteId, createPlace } from "@/api/place";
import PlaceFormModal from "@/components/PlaceFormModal.vue";
import Pagination from "@/components/Pagination.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import Button from "@/components/Button.vue";
import TruncatedTextCell from "@/components/TruncatedTextCell.vue";

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const parks = ref([]);
const routes = ref([]);
const places = ref([]);
const selectedParkId = ref(null);
const selectedRouteId = ref(null);
const selectedPlace = ref(null);
const showPlaceFormModal = ref(false);
const route = ref(null);

const totalPages = computed(() => Math.ceil(total.value / limit.value));

const parkOptions = computed(() =>
  parks.value.map((park) => ({ value: park.id, label: park.name }))
);
const routeOptions = computed(() =>
  routes.value.map((route) => ({
    value: route.route_id,
    label: route.route_name,
  }))
);

const loadParks = async () => {
  try {
    parks.value = await fetchParks();
    if (parks.value.length > 0) {
      selectedParkId.value = parks.value[0].id;
      loadRoutes();
    }
  } catch (error) {
    console.error("Failed to fetch parks:", error);
  }
};

const loadRoutes = async () => {
  if (!selectedParkId.value) return;

  try {
    const response = await fetchRoutesByParkId(selectedParkId.value, 1, 100);
    routes.value = response.data;
    if (routes.value.length > 0) {
      selectedRouteId.value = routes.value[0].route_id;
      route.value = routes.value[0];
      loadPlaces();
    }
  } catch (error) {
    console.error("Failed to fetch routes:", error);
  }
};

const loadPlaces = async () => {
  if (!selectedRouteId.value) return;

  try {
    const response = await fetchPlacesByRouteId(
      selectedRouteId.value,
      page.value,
      limit.value
    );
    places.value = response.data;
    total.value = response.total;
  } catch (error) {
    console.error("Failed to fetch places:", error);
  }
};

const openAddPlaceModal = () => {
  selectedPlace.value = {
    id: null,
    route_id: selectedRouteId.value,
    name: "",
    description: "",
    icon: "",
    location: "",
    area: 0,
    area_per_visitor: 0,
    return_coefficient: 0,
    days: 0,
    used_in_calculations: true,
  };
  showPlaceFormModal.value = true;
};

const editPlace = (place) => {
  selectedPlace.value = { ...place };
  showPlaceFormModal.value = true;
};

const closePlaceFormModal = () => {
  showPlaceFormModal.value = false;
  selectedPlace.value = null;
};

const handlePlaceFormSubmit = async (placeData) => {
  try {
    await createPlace(placeData);
    await loadPlaces();
    closePlaceFormModal();
  } catch (error) {
    console.error("Failed to add/update place:", error);
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value += 1;
    loadPlaces();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    loadPlaces();
  }
};

const setPage = (pageNumber) => {
  page.value = pageNumber;
  loadPlaces();
};

onMounted(() => {
  loadParks();
});

watch(selectedParkId, loadRoutes);
watch(selectedRouteId, loadPlaces);
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 1em;
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.place-icon {
  width: 24px;
  height: 24px;
}

.add-place-form {
  margin-top: 1em;
  background-color: #f9f9f9;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  flex-direction: column;
}

.form-check {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin: 10px 0 0;
}

.form-group {
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 4;
}

label {
  color: #6d7885;
  font-size: 13px;
}

input:not([type="checkbox"]),
select,
textarea {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f0f0f0;
}

.places-filters {
  display: flex;
  margin-bottom: 1em;
}

.places-tab-button {
  margin: 20px 0 10px;
}
</style>

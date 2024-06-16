<template>
  <div class="container">
    <div class="header">
      <h3>Места на маршруте</h3>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Название маршрута</th>
            <th>Длина (км)</th>
            <th>Время в пути (мин)</th>
            <th>Сложность</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="route in routes"
            :key="route.route_id"
            @click="selectRoute(route.route_id)"
            class="clickable-row"
          >
            <td>{{ route.route_name }}</td>
            <td>{{ route.route_length }}</td>
            <td>{{ route.route_duration }}</td>
            <td>{{ route.route_difficulty }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="places.length">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Иконка</th>
            <th>Местоположение</th>
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
            <td>{{ place.description }}</td>
            <td>{{ place.icon }}</td>
            <td>{{ place.location }}</td>
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

    <div v-if="selectedRouteId" class="add-place-form">
      <h4>
        {{ editingPlace ? "Редактировать место" : "Добавить новое место" }}
      </h4>
      <form @submit.prevent="addPlace()">
        <div class="form-grid">
          <div class="form-check">
            <input
              type="checkbox"
              id="calc"
              v-model="newPlace.used_in_calculations"
            />
            <label for="calc"> Используется в расчетах: </label>
          </div>
          <div class="form-group">
            <label>Название:</label>
            <input type="text" v-model="newPlace.name" required />
          </div>
          <div class="form-group">
            <label>Описание:</label>
            <textarea v-model="newPlace.description" required></textarea>
          </div>
          <div class="form-group">
            <label>Иконка:</label>
            <input type="text" v-model="newPlace.icon" />
          </div>
          <template v-if="newPlace.used_in_calculations">
            <div class="form-group">
              <label>Площадь (кв. м):</label>
              <input type="number" v-model="newPlace.area" required />
            </div>
            <div class="form-group">
              <label>Площадь на посетителя (кв. м):</label>
              <input
                type="number"
                v-model="newPlace.area_per_visitor"
                required
              />
            </div>
            <div class="form-group">
              <label>Коэффициент возвращения:</label>
              <input
                type="number"
                v-model="newPlace.return_coefficient"
                required
                step="0.01"
              />
            </div>
            <div class="form-group">
              <label>Дни:</label>
              <input type="number" v-model="newPlace.days" required />
            </div>
          </template>
        </div>
        <div class="form-group full-width">
          <button type="submit">
            {{ editingPlace ? "Обновить место" : "Добавить место" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchRoutes } from "@/api/routes";
import { fetchPlacesByRouteId, createPlace } from "@/api/place";

const routes = ref([]);
const places = ref([]);
const selectedRouteId = ref(null);
const editingPlace = ref(false);

const newPlace = ref({
  id: null,
  route_id: null,
  name: "",
  description: "",
  icon: "",
  location: "",
  area: null,
  area_per_visitor: null,
  return_coefficient: null,
  days: null,
  used_in_calculations: true,
});

const loadRoutes = async () => {
  try {
    routes.value = await fetchRoutes(1, 100); // загрузка всех маршрутов
  } catch (error) {
    console.error("Failed to fetch routes:", error);
  }
};

const loadPlaces = async () => {
  if (!selectedRouteId.value) return;

  try {
    places.value = await fetchPlacesByRouteId(selectedRouteId.value);
    newPlace.value.route_id = selectedRouteId.value; // set the route_id for newPlace
  } catch (error) {
    console.error("Failed to fetch places:", error);
  }
};

const selectRoute = (routeId) => {
  selectedRouteId.value = routeId;
  loadPlaces();
};

const addPlace = async () => {
  try {
    await createPlace(newPlace.value);
    await loadPlaces(); // reload places after adding
    resetForm();
  } catch (error) {
    console.error("Failed to add place:", error);
  }
};

const editPlace = (place) => {
  newPlace.value = { ...place };
  editingPlace.value = true;
};

const resetForm = () => {
  newPlace.value = {
    id: null,
    route_id: selectedRouteId.value,
    name: "",
    description: "",
    icon: "",
    location: "",
    area: null,
    area_per_visitor: null,
    return_coefficient: null,
    days: null,
    used_in_calculations: true,
  };
  editingPlace.value = false;
};

onMounted(() => {
  loadRoutes();
});
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

.table-wrapper {
  overflow-x: auto;
  margin-bottom: 1em;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
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
</style>

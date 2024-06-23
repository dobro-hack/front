<template>
  <div class="routes-header">
    <button class="create-button" @click="addNewRoute">Создать маршрут</button>
  </div>
  <Pagination
    :page="page"
    :totalPages="totalPages"
    @prev-page="prevPage"
    @next-page="nextPage"
    @set-page="setPage"
  />
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Описание</th>
          <th>Длина (км)</th>
          <th>Время в пути (мин)</th>
          <th>Сложность</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="route in routes"
          :key="route.route_id"
          @click="selectRoute(route)"
          class="clickable-row"
        >
          <td>{{ route.route_name }}</td>
          <td><TruncatedTextCell :text="route.route_description" /></td>
          <td>{{ route.route_length }}</td>
          <td>{{ route.route_duration }}</td>
          <td>{{ route.route_difficulty }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <RouteForm
    v-if="isFormVisible"
    :route="newRoute"
    :parks="parks"
    @close="isFormVisible = false"
    @submit="createRoute"
  />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Pagination from "@/components/Pagination.vue";
import RouteForm from "@/components/RouteForm.vue";
import {
  createRoute as createRouteAPI,
  fetchParks,
  fetchRoutes,
} from "@/api/routes";
import TruncatedTextCell from "@/components/TruncatedTextCell.vue";

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const isFormVisible = ref(false);
const newRouteAdding = ref(false);
const selectedRoute = ref(null);

const newRoute = ref({
  id: null,
  park_id: null,
  name: "",
  description: "",
  how_to_get: "",
  what_to_take: "",
  in_emergency: "",
  recommendations: "",
  photo: null,
  length: null,
  duration: null,
  height: null,
  difficulty: "easy",
  group_distance: null,
  average_time: null,
  group_size: null,
  days_on_route: null,
  gpx_data: null,
});

const addNewRoute = () => {
  newRouteAdding.value = true;
  selectedRoute.value = null;
  newRoute.value = {
    id: null,
    park_id: null,
    name: "",
    description: "",
    how_to_get: "",
    what_to_take: "",
    in_emergency: "",
    recommendations: "",
    photo: null,
    length: null,
    duration: null,
    height: null,
    difficulty: "easy",
    group_distance: null,
    average_time: null,
    group_size: null,
    days_on_route: null,
    gpx_data: null,
  };
  isFormVisible.value = true;
};

const parks = ref([]);
const routes = ref([]);
const createdRoute = ref(null);

const totalPages = computed(() => Math.ceil(total.value / limit.value));

const loadParks = async () => {
  try {
    parks.value = await fetchParks();
  } catch (error) {
    console.error("Failed to fetch parks:", error);
  }
};

const loadRoutes = async (page, limit) => {
  try {
    const response = await fetchRoutes(page, limit);
    routes.value = response.data;
    total.value = response.total;
  } catch (error) {
    console.error("Failed to fetch routes:", error);
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value += 1;
    loadRoutes(page.value, limit.value);
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    loadRoutes(page.value, limit.value);
  }
};

const setPage = (pageNumber) => {
  page.value = pageNumber;
  loadRoutes(page.value, limit.value);
};

const selectRoute = (route) => {
  newRouteAdding.value = false;
  selectedRoute.value = route;
  newRoute.value = { ...route };
  newRoute.value.id = route.route_id;
  newRoute.value.park_id = route.park_id;
  newRoute.value.name = route.route_name;
  newRoute.value.description = route.route_description;
  newRoute.value.how_to_get = route.how_to_get;
  newRoute.value.what_to_take = route.what_to_take;
  newRoute.value.in_emergency = route.in_emergency;
  newRoute.value.recommendations = route.recommendations;
  newRoute.value.photo = route.photo;
  newRoute.value.length = route.route_length;
  newRoute.value.duration = route.route_duration;
  newRoute.value.height = route.route_height;
  newRoute.value.difficulty = route.route_difficulty;
  newRoute.value.group_distance = route.group_distance;
  newRoute.value.average_time = route.average_time;
  newRoute.value.group_size = route.group_size;
  newRoute.value.days_on_route = route.days_on_route;
  newRoute.value.gpx_data = route.gpx_data;
  isFormVisible.value = true;
};

const createRoute = async (routeData) => {
  try {
    const response = await createRouteAPI(routeData);
    createdRoute.value = response;
    newRoute.value = {
      id: null,
      park_id: null,
      name: "",
      description: "",
      how_to_get: "",
      what_to_take: "",
      in_emergency: "",
      recommendations: "",
      length: null,
      duration: null,
      height: null,
      difficulty: "easy",
      group_distance: null,
      average_time: null,
      group_size: null,
      days_on_route: null,
      gpx_data: null,
    };
    isFormVisible.value = false;
    loadRoutes(page.value, limit.value); // Reload routes after creation
  } catch (error) {
    console.error("Failed to create route:", error);
  }
};

onMounted(() => {
  loadParks();
  loadRoutes(page.value, limit.value);
});
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 1em;
  background-color: #fff;
}

.routes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 20px;
}

.create-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 5px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #218838;
}

.table-wrapper {
  margin-bottom: 1em;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f0f0f0;
}
</style>

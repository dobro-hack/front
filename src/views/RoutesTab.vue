<template>
  <div class="container">
    <div class="header">
      <h3>Создание и редактирование маршрутов</h3>
      <button class="create-button" @click="addNewRoute">Создать новый</button>
    </div>
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Страница {{ page }}</span>
      <button @click="nextPage">Next</button>
    </div>
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
            <td>{{ route.route_description }}</td>
            <td>{{ route.route_length }}</td>
            <td>{{ route.route_duration }}</td>
            <td>{{ route.route_difficulty }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <form
      v-if="newRouteAdding || selectedRoute"
      @submit.prevent="createRoute"
      class="form-grid"
    >
      <div class="form-group">
        <label>Парк:</label>
        <select v-model="newRoute.park_id" required>
          <option v-for="park in parks" :key="park.id" :value="park.id">
            {{ park.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Название маршрута:</label>
        <input type="text" v-model="newRoute.name" required />
      </div>
      <div class="form-group">
        <label>Описание маршрута:</label>
        <textarea v-model="newRoute.description" required></textarea>
      </div>
      <div class="form-group">
        <label>Как добраться:</label>
        <input type="text" v-model="newRoute.how_to_get" required />
      </div>
      <div class="form-group">
        <label>Что взять с собой:</label>
        <input type="text" v-model="newRoute.what_to_take" required />
      </div>
      <div class="form-group">
        <label>В случае ЧС:</label>
        <input type="text" v-model="newRoute.in_emergency" required />
      </div>
      <div class="form-group">
        <label>Рекомендации:</label>
        <input type="text" v-model="newRoute.recommendations" required />
      </div>
      <div class="form-group">
        <label>Фото (JSON):</label>
        <textarea v-model="newRoute.photo"></textarea>
      </div>
      <div class="form-group">
        <label>Длина маршрута (км):</label>
        <input type="number" v-model="newRoute.length" required />
      </div>
      <div class="form-group">
        <label>Время в пути (мин):</label>
        <input type="number" v-model="newRoute.duration" required />
      </div>
      <div class="form-group">
        <label>Высота (м):</label>
        <input type="number" v-model="newRoute.height" />
      </div>
      <div class="form-group">
        <label>Сложность маршрута:</label>
        <select v-model="newRoute.difficulty" required>
          <option value="easy">Легкий</option>
          <option value="medium">Средний</option>
          <option value="hard">Сложный</option>
        </select>
      </div>
      <div class="form-group">
        <label>Оптимальное расстояние между группами (км):</label>
        <input type="number" v-model="newRoute.group_distance" required />
      </div>
      <div class="form-group">
        <label>Среднее время прохождения маршрута (часов):</label>
        <input type="number" v-model="newRoute.average_time" required />
      </div>
      <div class="form-group">
        <label>Среднее количество человек в группе:</label>
        <input type="number" v-model="newRoute.group_size" required />
      </div>
      <div class="form-group">
        <label>Количество дней пребывания на маршруте:</label>
        <input type="number" v-model="newRoute.days_on_route" required />
      </div>
      <div class="form-group full-width">
        <button type="submit">
          {{ newRouteAdding ? "Создать маршрут" : "Обновить маршрут" }}
        </button>
      </div>
    </form>
    <div v-if="createdRoute" class="route-info">
      <h4>Маршрут создан успешно:</h4>
    </div>
    <MapAddRoute
      v-if="selectedRoute || newRouteAdding"
      :route="newRoute"
      @updateGpxData="updateGpxData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MapAddRoute from "./MapAddRoute.vue";
import {
  createRoute as createRouteAPI,
  fetchParks,
  fetchRoutes,
} from "@/api/routes";

const page = ref(1);
const limit = ref(10);
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
};

const parks = ref([]);
const routes = ref([]);
const createdRoute = ref(null);

const loadParks = async () => {
  try {
    parks.value = await fetchParks();
  } catch (error) {
    console.error("Failed to fetch parks:", error);
  }
};

const loadRoutes = async (page, limit) => {
  try {
    routes.value = await fetchRoutes(page, limit);
  } catch (error) {
    console.error("Failed to fetch routes:", error);
  }
};

const nextPage = () => {
  page.value += 1;
  loadRoutes(page.value, limit.value);
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    loadRoutes(page.value, limit.value);
  }
};

const selectRoute = (route) => {
  newRouteAdding.value = true;
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
};

const createRoute = async () => {
  try {
    const response = await createRouteAPI(newRoute.value);
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
  } catch (error) {
    console.error("Failed to create route:", error);
  }
};

const updateGpxData = (gpxData) => {
  console.warn("updateGpxData", updateGpxData);
  newRoute.value.gpx_data = gpxData;
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.pagination-controls {
  margin-bottom: 1em;
}

.table-wrapper {
  margin-bottom: 1em;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1em;
}

.form-group {
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

input,
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

.route-info {
  margin-top: 1em;
  padding: 1em;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f0f0f0;
}
</style>

<template>
  <div class="container">
    <div class="header">
      <h3>Создание нового маршрута</h3>
      <button class="create-button" @click="addNewRoute">Создать новый</button>
    </div>
    <form v-if="newRouteAdding" @submit.prevent="createRoute" class="form-grid">
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
        <label>Нагрузка (JSON):</label>
        <textarea v-model="newRoute.load"></textarea>
      </div>
      <div class="form-group">
        <label>Максимальная нагрузка (JSON):</label>
        <textarea v-model="newRoute.max_load"></textarea>
      </div>
      <div class="form-group full-width">
        <button type="submit">Создать маршрут</button>
      </div>
    </form>
    <div v-if="createdRoute" class="route-info">
      <h4>Маршрут создан успешно:</h4>
      <p><strong>Название:</strong> {{ createdRoute.name }}</p>
      <p><strong>Описание:</strong> {{ createdRoute.description }}</p>
      <p><strong>Как добраться:</strong> {{ createdRoute.how_to_get }}</p>
      <p><strong>Что взять с собой:</strong> {{ createdRoute.what_to_take }}</p>
      <p><strong>В случае ЧС:</strong> {{ createdRoute.in_emergency }}</p>
      <p><strong>Рекомендации:</strong> {{ createdRoute.recommendations }}</p>
      <p><strong>Фото:</strong> {{ createdRoute.photo }}</p>
      <p><strong>Длина:</strong> {{ createdRoute.length }} км</p>
      <p><strong>Время в пути:</strong> {{ createdRoute.duration }} мин</p>
      <p><strong>Высота:</strong> {{ createdRoute.height }} м</p>
      <p><strong>Сложность:</strong> {{ createdRoute.difficulty }}</p>
      <p><strong>Нагрузка:</strong> {{ createdRoute.load }}</p>
      <p><strong>Максимальная нагрузка:</strong> {{ createdRoute.max_load }}</p>
    </div>
    <MapAddRoute></MapAddRoute>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MapAddRoute from "./MapAddRoute.vue";
import { createRoute as createRouteAPI, fetchParks } from "@/api/routes";

const newRouteAdding = ref(false);

const newRoute = ref({
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
  load: null,
  max_load: null,
});

const addNewRoute = () => {
  newRouteAdding.value = true;
};

const parks = ref([]);
const createdRoute = ref(null);

const loadParks = async () => {
  try {
    parks.value = await fetchParks();
  } catch (error) {
    console.error("Failed to fetch parks:", error);
  }
};

const createRoute = async () => {
  try {
    const response = await createRouteAPI(newRoute.value);
    createdRoute.value = response;
    newRoute.value = {
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
      load: null,
      max_load: null,
    };
  } catch (error) {
    console.error("Failed to create route:", error);
  }
};

onMounted(() => {
  loadParks();
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
  grid-column: span 2;
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
</style>

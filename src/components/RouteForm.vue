<template>
  <div class="form-popup">
    <div class="form-popup-content">
      <div class="form-popup-header">
        <h3>
          {{ isNewRoute ? "Создание маршрута" : "Редактирование маршрута" }}
        </h3>
        <button class="close-button" @click="emits('close')">&times;</button>
      </div>
      <MapAddRoute :route="route" @updateGpxData="updateGpxData" />
      <form class="form-grid">
        <div class="form-group">
          <label>Парк:</label>
          <select v-model="route.park_id" required>
            <option v-for="park in parks" :key="park.id" :value="park.id">
              {{ park.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Название маршрута:</label>
          <input type="text" v-model="route.name" required />
        </div>
        <div class="form-group form-group-2-rows">
          <label>Описание маршрута:</label>
          <textarea v-model="route.description" required></textarea>
        </div>
        <div class="form-group">
          <label>Как добраться:</label>
          <input type="text" v-model="route.how_to_get" required />
        </div>
        <div class="form-group">
          <label>Что взять с собой:</label>
          <input type="text" v-model="route.what_to_take" required />
        </div>
        <div class="form-group">
          <label>В случае ЧС:</label>
          <input type="text" v-model="route.in_emergency" required />
        </div>
        <div class="form-group">
          <label>Рекомендации:</label>
          <input type="text" v-model="route.recommendations" required />
        </div>
        <div class="form-group">
          <label>Длина маршрута (км):</label>
          <input type="number" v-model="route.length" required />
        </div>
        <div class="form-group">
          <label>Время в пути (мин):</label>
          <input type="number" v-model="route.duration" required />
        </div>
        <div class="form-group">
          <label>Высота (м):</label>
          <input type="number" v-model="route.height" />
        </div>
        <div class="form-group">
          <label>Сложность маршрута:</label>
          <select v-model="route.difficulty" required>
            <option value="easy">Легкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </select>
        </div>
        <div class="form-group">
          <label>Оптимальное расстояние между группами (км):</label>
          <input type="number" v-model="route.group_distance" required />
        </div>
        <div class="form-group">
          <label>Среднее время прохождения маршрута (часов):</label>
          <input type="number" v-model="route.average_time" required />
        </div>
        <div class="form-group">
          <label>Среднее количество человек в группе:</label>
          <input type="number" v-model="route.group_size" required />
        </div>
        <div class="form-group">
          <label>Количество дней пребывания на маршруте:</label>
          <input type="number" v-model="route.days_on_route" required />
        </div>
        <div class="form-group full-width">
          <Button @click="submitForm">{{
            isNewRoute ? "Создать маршрут" : "Обновить маршрут"
          }}</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import MapAddRoute from "./MapAddRoute.vue";
import Button from "./Button.vue";

const props = defineProps({
  route: Object,
  parks: Array,
});

const emits = defineEmits(["submit", "close"]);

const isNewRoute = ref(!props.route.id);

const route = ref({ ...props.route });

const submitForm = () => {
  const routeData = { ...route.value };
  emits("submit", routeData);
};

watch(props, (newProps) => {
  route.value = { ...newProps.route };
});

const updateGpxData = (gpxData) => {
  route.value.gpx_data = gpxData;
};
</script>

<style scoped>
.form-popup {
  position: fixed;
  right: 0;
  top: 0;
  width: 800px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
}

.form-popup-content {
  padding: 20px;
}

.form-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
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
</style>

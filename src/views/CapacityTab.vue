<template>
  <div>
    <h3>Расчет рекреационной емкости</h3>
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Page {{ page }}</span>
      <button @click="nextPage">Next</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Длина (км)</th>
            <th>Время в пути</th>
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
    <div v-if="selectedRoute">
      <h4>Данные маршрута</h4>
      <p><strong>Описание:</strong> {{ selectedRoute.route_description }}</p>
      <p><strong>Длина (км):</strong> {{ selectedRoute.route_length }}</p>
      <p><strong>Время в пути:</strong> {{ selectedRoute.route_duration }}</p>
      <p><strong>Сложность:</strong> {{ selectedRoute.route_difficulty }}</p>
      <div>
        <h4>Расчет для линейного маршрута</h4>
        <form @submit.prevent="calculateBCC">
          <label>
            Оптимальное расстояние между группами (км):
            <input type="string" v-model="groupDistance" required />
          </label>
          <label>
            Длина светового дня (часов):
            <input type="number" v-model="dayLength" required />
          </label>
          <label>
            Среднее время прохождения маршрута (часов):
            <input type="number" v-model="averageTime" required />
          </label>
          <label>
            Среднее количество человек в группе:
            <input type="number" v-model="groupSize" required />
          </label>
          <label>
            Количество дней пребывания на маршруте:
            <input type="number" v-model="daysOnRoute" required />
          </label>
          <label>
            Поправочные коэффициенты (0-1):
            <input
              type="number"
              v-model="correctionFactor"
              required
              step="0.01"
              min="0"
              max="1"
            />
          </label>
          <label>
            Коэффициент управленческой емкости (0-1):
            <input
              type="number"
              v-model="managementCapacityFactor"
              required
              step="0.01"
              min="0"
              max="1"
            />
          </label>
          <button type="submit">Рассчитать</button>
        </form>
        <div v-if="bcc !== null">
          <h4>Базовая рекреационная емкость: {{ bcc }} человек</h4>
        </div>
        <div v-if="pcc !== null">
          <h4>Потенциальная рекреационная емкость: {{ pcc }} человек</h4>
        </div>
        <div v-if="rcc !== null">
          <h4>Предельно допустимая рекреационная емкость: {{ rcc }} человек</h4>
        </div>
      </div>
    </div>
    <MapVisualisation></MapVisualisation>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MapVisualisation from "./MapVisualisation.vue";
import { fetchRoutes } from "@/api/routes";

const routes = ref([]);
const page = ref(1);
const limit = ref(10);
const selectedRoute = ref(null);
const bcc = ref(null);
const pcc = ref(null);
const rcc = ref(null);

// Дефолтные значения для полей расчета линейного маршрута
const groupDistance = ref(2);
const dayLength = ref(12);
const averageTime = ref(6);
const groupSize = ref(5);
const daysOnRoute = ref(1);
const correctionFactor = ref(0.9);
const managementCapacityFactor = ref(0.8);

const loadRoutes = async (page, limit) => {
  try {
    const response = await fetchRoutes(page, limit);
    routes.value = response;
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
  selectedRoute.value = route;
  bcc.value = null; // Сбрасываем результат при выборе нового маршрута
  pcc.value = null;
  rcc.value = null;
};

const calculateBCC = () => {
  const DTp = selectedRoute.value.route_length;
  const DGp = groupDistance.value;
  const Ts = dayLength.value;
  const Tdp = averageTime.value;
  const GS = groupSize.value;
  const tp = daysOnRoute.value;

  // BCCq Calculation
  bcc.value = Math.floor((DTp / DGp) * (Ts / Tdp) * GS * tp);

  // PCCq Calculation
  pcc.value = Math.floor(bcc.value * correctionFactor.value);

  // RCCq Calculation
  rcc.value = Math.floor(pcc.value * managementCapacityFactor.value);
};

onMounted(() => {
  loadRoutes(page.value, limit.value);
});
</script>

<style scoped>
.pagination-controls {
  margin-bottom: 1em;
}

.table-wrapper {
  margin-bottom: 1em;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 1em;
}

button {
  width: 100px;
  padding: 0.5em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f0f0f0;
}
</style>

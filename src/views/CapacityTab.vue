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
    <div v-if="selectedRoute" class="route-details">
      <h4>Данные маршрута</h4>

      <ul class="route-info">
        <li>
          <strong>Описание:</strong> {{ selectedRoute.route_description }}
        </li>
        <li><strong>Длина (км):</strong> {{ selectedRoute.route_length }}</li>
        <li>
          <strong>Время в пути:</strong> {{ selectedRoute.route_duration }}
        </li>
        <li>
          <strong>Сложность:</strong> {{ selectedRoute.route_difficulty }}
        </li>
      </ul>
      <div>
        <h4>Выбор периода расчета</h4>
        <label>
          Период (в днях):
          <input type="number" v-model="calculationPeriod" required />
        </label>
        <button @click="calculateBCC">Рассчитать</button>
      </div>
      <div v-if="formulas.length">
        <h4>Формулы для площадных объектов</h4>
        <ul>
          <li v-for="formula in formulas" :key="formula.placeId">
            {{ formula.formula }}
          </li>
        </ul>
      </div>
      <div v-if="totalFormula">
        <h4>Итоговая формула</h4>
        <p>{{ totalFormula }}</p>
      </div>
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
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import LoadChart from "../components/LoadChart.vue";
import { fetchRoutes } from "@/api/routes";
import { fetchPlacesByRouteId } from "@/api/place";

const routes = ref([]);
const page = ref(1);
const limit = ref(10);
const selectedRoute = ref(null);
const places = ref([]);
const formulas = ref([]);
const totalFormula = ref(null);
const bcc = ref(null);
const pcc = ref(null);
const rcc = ref(null);
const calculationPeriod = ref(30); // Default to 30 days

const loadRoutes = async (page, limit) => {
  try {
    const response = await fetchRoutes(page, limit);
    routes.value = response;
  } catch (error) {
    console.error("Failed to fetch routes:", error);
  }
};

const loadPlaces = async (routeId) => {
  try {
    places.value = await fetchPlacesByRouteId(routeId);
  } catch (error) {
    console.error("Failed to fetch places:", error);
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
  formulas.value = [];
  totalFormula.value = null;
  loadPlaces(route.route_id).then(calculateBCC);
};

const calculateBCC = () => {
  bcc.value = null; // Сбрасываем результат при выборе нового маршрута
  pcc.value = null;
  rcc.value = null;
  formulas.value = [];
  totalFormula.value = null;

  const DTp = selectedRoute.value.route_length;
  const DGp = selectedRoute.value.group_distance;
  const Ts = 12; // Длина светового дня фиксирована на 12 часов
  const Tdp = selectedRoute.value.average_time;
  const GS = selectedRoute.value.group_size;
  const tp = selectedRoute.value.days_on_route;

  const correctionCoefficient = 1; // Default coefficient value for simplicity

  // BCCq Calculation for linear or multi-day route
  let totalBCC = 0;
  let linearFormula;

  if (Tdp > Ts) {
    // Multi-day route
    totalBCC = Math.floor(
      GS * tp * (calculationPeriod.value / tp) * correctionCoefficient
    );
    linearFormula = `${GS} * ${tp} * (${calculationPeriod.value} / ${tp}) * ${correctionCoefficient}`;
  } else {
    // One-day route
    totalBCC = Math.floor(
      (DTp / DGp) *
        (Ts / Tdp) *
        GS *
        tp *
        (calculationPeriod.value / tp) *
        correctionCoefficient
    );
    linearFormula = `(${DTp} / ${DGp}) * (${Ts} / ${Tdp}) * ${GS} * ${tp} * (${calculationPeriod.value} / ${tp}) * ${correctionCoefficient}`;
  }

  // BCCq Calculation for places
  places.value.forEach((place) => {
    const { id, area, area_per_visitor, return_coefficient, days } = place;
    const BCCq = Math.floor(
      (area / area_per_visitor) *
        return_coefficient *
        days *
        (calculationPeriod.value / days) *
        correctionCoefficient
    );
    totalBCC += BCCq;
    const formula = `(${area} / ${area_per_visitor}) * ${return_coefficient} * ${days} * (${calculationPeriod.value} / ${days}) * ${correctionCoefficient}`;
    formulas.value.push({ placeId: id, formula });
  });

  bcc.value = totalBCC;
  totalFormula.value =
    linearFormula + " + " + formulas.value.map((f) => f.formula).join(" + ");
};

onMounted(() => {
  loadRoutes(page.value, limit.value);
});

watch(selectedRoute, calculateBCC, { deep: true });
</script>

<style scoped>
.pagination-controls {
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
  gap: 1em;
}

.table-wrapper {
  margin-bottom: 1em;
  overflow-x: auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 1em;
}

button {
  width: 200px;
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

.route-details {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.route-info {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  flex-direction: column;
}

.route-info li {
  background: #f9f9f9;
  padding: 0.5em;
  border-radius: 5px;
}

.coefficient-sliders {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}

.coefficient-slider {
  flex: 0 0 100%;
  display: flex;
  gap: 0.5em;
}

.coefficient-slider label {
  font-weight: bold;
  flex: 0 0 50%;
}

.coefficient-slider input {
  flex: 0 0 50%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 1em;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>

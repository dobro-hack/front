<template>
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
          <td><TruncatedTextCell :text="route.route_description" /></td>
          <td>{{ route.route_length }}</td>
          <td>{{ route.route_duration }}</td>
          <td>{{ route.route_difficulty }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination
    :page="page"
    :total-pages="totalPages"
    @prev-page="prevPage"
    @next-page="nextPage"
    @set-page="setPage"
  />
  <div v-if="selectedRoute" class="route-details">
    <div v-if="formulas.length">
      <h4>Формулы для площадных объектов</h4>
      <div class="formula-container">
        <div
          v-for="formula in formulas"
          :key="formula.placeId"
          class="formula-item"
        >
          <div class="formula-content">{{ formula.formula }}</div>
          <p class="formula-explanation">Рассчёт для {{ formula.placeName }}</p>
        </div>
      </div>
    </div>
    <div v-if="totalFormula">
      <h4>Итоговая формула</h4>
      <div class="formula-total">
        <div class="formula-content">{{ totalFormula }}</div>
        <p class="formula-explanation">
          Это комбинированная формула для всех частей маршрута и мест.
        </p>
      </div>
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
    <div>
      <h4>Выбор периода расчета</h4>
      <label>
        Период (в днях):
        <input type="number" v-model="calculationPeriod" required />
      </label>
      <Button @click="calculateBCC">Рассчитать</Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Pagination from "@/components/Pagination.vue";
import { fetchRoutes } from "@/api/routes";
import { fetchPlacesByRouteId } from "@/api/place";
import TruncatedTextCell from "@/components/TruncatedTextCell.vue";
import Button from "@/components/Button.vue";

const routes = ref([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const selectedRoute = ref(null);
const places = ref([]);
const formulas = ref([]);
const totalFormula = ref(null);
const bcc = ref(null);
const pcc = ref(null);
const rcc = ref(null);
const calculationPeriod = ref(30); // Default to 30 days

const totalPages = computed(() => Math.ceil(total.value / limit.value));

const loadRoutes = async (page, limit) => {
  try {
    const response = await fetchRoutes(page, limit);
    routes.value = response.data;
    total.value = response.total;
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
  places.value.data
    .filter((place) => place.used_in_calculations)
    .forEach((place) => {
      const { id, name, area, area_per_visitor, return_coefficient, days } =
        place;
      const BCCq = Math.floor(
        (area / area_per_visitor) *
          return_coefficient *
          days *
          (calculationPeriod.value / days) *
          correctionCoefficient
      );
      totalBCC += BCCq;
      const formula = `(${area} / ${area_per_visitor}) * ${return_coefficient} * ${days} * (${calculationPeriod.value} / ${days}) * ${correctionCoefficient}`;
      formulas.value.push({ placeId: id, placeName: name, formula });
    });

  bcc.value = totalBCC;
  totalFormula.value =
    linearFormula + " + " + formulas.value.map((f) => f.formula).join(" + ");
};

onMounted(() => {
  loadRoutes(page.value, limit.value);
});
</script>

<style scoped>
.header {
  margin-bottom: 1em;
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

.formula-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1em;
}

.formula-item {
  display: flex;
  justify-content: space-between;
  background-color: #f0f8ff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 1em;
}

.formula-total {
  background-color: #e6ffe6;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 1em;
}

.formula-content {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}

.formula-explanation {
  margin-top: 0.5em;
  text-align: center;
  color: #666;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

input {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin: 0 15px;
}
</style>

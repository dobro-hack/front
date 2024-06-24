<template>
  <tr @click="setSelectedRequest(request)">
    <td>
      <RouteDetails :route="request"></RouteDetails>
    </td>
    <td>{{ request.quantity }}</td>
    <td>
      <div>{{ formatDate(request.request_start_date) }}</div>
      <div>{{ formatTime(request.request_start_date) }}</div>
    </td>
    <td>
      {{ getRouteLoadForDay(request.route_load, request.request_start_date) }} /
      {{
        getRouteMaxLoadForDay(
          request.route_max_load,
          request.request_start_date
        )
      }}
    </td>
  </tr>
  <tr
    v-if="selectedRequest && selectedRequest.request_id === request.request_id"
  >
    <td colspan="6" class="details">
      <div class="details-section">
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">Парк:</span>
            <span class="detail-value">{{ selectedRequest.park_name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Маршрут:</span>
            <span class="detail-value">{{ selectedRequest.route_name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Планируемая дата:</span>
            <span class="detail-value">{{
              selectedRequest.request_start_date
            }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Сложность:</span>
            <span class="detail-value">{{
              selectedRequest.route_difficulty
            }}</span>
          </div>
        </div>
      </div>
      <div class="details-section">
        <h4>Посетитель №1</h4>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">Фамилия:</span>
            <span class="detail-value">{{ selectedRequest.last_name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Имя:</span>
            <span class="detail-value">{{ selectedRequest.first_name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Отчество:</span>
            <span class="detail-value">{{ selectedRequest.middle_name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Дата рождения:</span>
            <span class="detail-value">{{ selectedRequest.birthday }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Паспорт:</span>
            <span class="detail-value">{{ selectedRequest.passport }}</span>
          </div>
        </div>
      </div>
      <div class="details-section">
        {{ request.route_description }}
      </div>
    </td>
  </tr>
</template>

<script setup>
import { defineProps } from "vue";
import RouteDetails from "@/components/RouteDetails.vue";

const props = defineProps({
  request: Object,
  selectedRequest: Object,
  setSelectedRequest: Function,
  approve: Function,
  reject: Function,
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU");
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusClass = (status) => {
  return {
    "status-new": status === "Новая",
    "status-approved": status === "Одобрено",
    "status-rejected": status === "Отказано",
  };
};

const getDayOfYear = (dateString) => {
  const date = new Date(dateString);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const getRouteLoadForDay = (routeLoad, dateString) => {
  const dayOfYear = getDayOfYear(dateString);
  const loadArray = routeLoad;
  return loadArray ? loadArray[dayOfYear] : 0;
};

const getRouteMaxLoadForDay = (routeMaxLoad, dateString) => {
  const dayOfYear = getDayOfYear(dateString);
  const maxLoadArray = routeMaxLoad;
  return maxLoadArray ? maxLoadArray[dayOfYear] : 0;
};
</script>

<style scoped>
.route-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-right: 10px;
}

.park-name {
  color: #6c757d;
  font-size: 12px;
}

.status-new {
  color: orange;
}

.status-approved {
  color: green;
}

.status-rejected {
  color: red;
}

.details {
  background-color: #f9f9f9;
  padding: 20px;
  border-top: 1px solid #ddd;
}

.details-section {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
}

.detail-item {
  flex: 1 1 20%;
  margin-bottom: 10px;
}

.detail-label {
  font-weight: bold;
  color: #6c757d;
}

.detail-value {
  margin-left: 5px;
  color: #343a40;
}

.button-group {
  display: flex;
  justify-content: flex-start;
}
</style>

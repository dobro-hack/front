<template>
  <tr @click="setSelectedRequest(request)">
    <td>{{ request.route_name }}</td>
    <td>{{ request.request_status }}</td>
    <td>{{ request.route_description }}</td>
    <td>{{ request.route_length }}</td>
    <td>{{ request.route_duration }}</td>
    <td>{{ request.route_height }}</td>
  </tr>
  <tr
    v-if="selectedRequest && selectedRequest.request_id === request.request_id"
  >
    <td colspan="6" class="details">
      <div class="details-section">
        <h3>О заявке</h3>
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
            <span class="detail-label">Тип:</span>
            <span class="detail-value">{{
              selectedRequest.route_description
            }}</span>
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
      <div class="button-group">
        <button @click.stop="approve">Согласовать</button>
        <button @click.stop="reject">Отказать</button>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  request: Object,
  selectedRequest: Object,
  setSelectedRequest: Function,
  approve: Function,
  reject: Function,
});
</script>

<style>
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

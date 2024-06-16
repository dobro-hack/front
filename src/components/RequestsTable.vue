<template>
  <div>
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Страница {{ page }}</span>
      <button @click="nextPage">Next</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Название объявления</th>
            <th>Статус</th>
            <th>Трансляция</th>
            <th>Бюджет</th>
            <th>Потрачено</th>
            <th>Результат</th>
          </tr>
        </thead>
        <tbody>
          <RequestsRow
            v-for="(request, index) in requests"
            :key="request.request_id"
            :request="request"
            :selectedRequest="selectedRequest"
            :setSelectedRequest="setSelectedRequest"
            :approve="approve"
            :reject="reject"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import RequestsRow from "./RequestsRow.vue";
import { fetchRequests } from "@/api/requests";

const requests = ref([]);
const page = ref(1);
const limit = ref(10);
const selectedRequest = ref(null);

const loadRequests = async (page, limit) => {
  try {
    const data = await fetchRequests(page, limit);
    requests.value = data;
  } catch (error) {
    console.error("Failed to load requests:", error);
  }
};

const setSelectedRequest = (request) => {
  selectedRequest.value = request;
};

const approve = () => {
  if (selectedRequest.value) {
    selectedRequest.value.status = "approved";
  }
};

const reject = () => {
  if (selectedRequest.value) {
    selectedRequest.value.status = "declined";
  }
};

const nextPage = () => {
  page.value += 1;
  loadRequests(page.value, limit.value);
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    loadRequests(page.value, limit.value);
  }
};

onMounted(() => {
  loadRequests(page.value, limit.value);
});
</script>

<style>
.table-wrapper {
  border: 1px solid #e1e3e6;
  border-radius: 16px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: none;
}

th,
td {
  padding: 8px;
}

td {
  border-top: 1px solid #ddd;
}

th {
  background: #f5f5f5;
  border-color: #e1e3e6;
}

tr:hover {
  cursor: pointer;
  background: #f9f9f9;
}

tr.m--active {
  cursor: default;
  background: #f9f9f9;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #0056b3;
}
</style>

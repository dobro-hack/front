<template>
  <div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Маршрут</th>
            <th>Статус</th>
            <th>Тип</th>
            <th>Кол-во</th>
            <th>Дата</th>
            <th>Вместимость на дату</th>
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
    <Pagination
      :page="page"
      :total-pages="totalPages"
      @prev-page="prevPage"
      @next-page="nextPage"
      @set-page="setPage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import RequestsRow from "./RequestsRow.vue";
import Pagination from "@/components/Pagination.vue";
import { fetchRequests } from "@/api/requests";

const requests = ref([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const selectedRequest = ref(null);

const totalPages = computed(() => Math.ceil(total.value / limit.value));

const loadRequests = async (page, limit) => {
  try {
    const response = await fetchRequests(page, limit);
    requests.value = response.data;
    total.value = response.total;
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
  if (page.value < totalPages.value) {
    page.value += 1;
    loadRequests(page.value, limit.value);
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    loadRequests(page.value, limit.value);
  }
};

const setPage = (pageNumber) => {
  page.value = pageNumber;
  loadRequests(page.value, limit.value);
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
</style>

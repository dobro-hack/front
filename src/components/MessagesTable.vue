<template>
  <div>
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Page {{ page }}</span>
      <button @click="nextPage">Next</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Статус</th>
            <th>Тип</th>
            <th>Дата отправки</th>
            <th>Пользователь</th>
            <th>Парк</th>
            <th>Маршрут</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="message in messages" :key="message.message_id">
            <td>{{ message.message_title }}</td>
            <td>{{ message.message_status }}</td>
            <td>{{ message.message_type }}</td>
            <td>{{ message.message_sent_at }}</td>
            <td>{{ message.user_first_name }} {{ message.user_last_name }}</td>
            <td>{{ message.park_name }}</td>
            <td>{{ message.route_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchMessages } from "@/api/messages";

const messages = ref([]);
const page = ref(1);
const limit = ref(10);

const loadMessages = async (page, limit) => {
  try {
    const data = await fetchMessages(page, limit);
    messages.value = data;
  } catch (error) {
    console.error("Failed to load messages:", error);
  }
};

const nextPage = () => {
  page.value += 1;
  loadMessages(page.value, limit.value);
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    loadMessages(page.value, limit.value);
  }
};

onMounted(() => {
  loadMessages(page.value, limit.value);
});
</script>

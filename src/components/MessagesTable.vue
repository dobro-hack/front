<template>
  <div>
    <FilterGroup
      :filters="filterConfig"
      :current-filter="currentFilter"
      @update-filter="updateFilter"
    />
    <template v-if="messages.length > 0">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Сообщение</th>
              <th>Статус</th>
              <th>Тип</th>
              <th>Дата отправки</th>
              <th>Пользователь</th>
              <th>Маршрут</th>
              <th v-if="currentFilter.status === 'pending'">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="message in messages" :key="message.message_id">
              <td>{{ message.message_content }}</td>
              <td>{{ message.message_status }}</td>
              <td>{{ message.message_type }}</td>
              <td>{{ formatDate(message.message_sent_at) }}</td>
              <td>
                {{ message.user_first_name }} {{ message.user_last_name }}
              </td>
              <td>{{ message.route_name }}</td>
              <td
                v-if="message.message_status === 'pending'"
                class="message-buttons"
              >
                <Button
                  class="message-button message-button-accept"
                  @click="handleAction('accept', message.message_id)"
                >
                  Принять
                </Button>
                <Button
                  class="message-button message-button-decline"
                  @click="handleAction('decline', message.message_id)"
                >
                  Отклонить
                </Button>
              </td>
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
    </template>
    <NoRecordsFound v-else message="Таких записей не найдено" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { fetchMessages } from "@/api/messages";
import NoRecordsFound from "@/components/NoRecordsFound.vue";
import Pagination from "@/components/Pagination.vue";
import FilterGroup from "@/components/FilterGroup.vue";
import Button from "./Button.vue";

const messages = ref([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const currentFilter = ref({ status: "pending" });

const filterConfig = ref([
  {
    key: "status",
    options: [
      { value: "pending", text: "Новые" },
      { value: "delivered", text: "Принятые" },
      { value: "declined", text: "Отклонённые" },
    ],
  },
]);

const totalPages = computed(() => Math.ceil(total.value / limit.value));

const loadMessages = async (page, limit, filters) => {
  try {
    const response = await fetchMessages(page, limit, filters.status);
    messages.value = response.data;
    total.value = response.total;
  } catch (error) {
    console.error("Failed to load messages:", error);
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value += 1;
    loadMessages(page.value, limit.value, currentFilter.value);
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
    loadMessages(page.value, limit.value, currentFilter.value);
  }
};

const setPage = (pageNumber) => {
  page.value = pageNumber;
  loadMessages(page.value, limit.value, currentFilter.value);
};

const updateFilter = (key, value) => {
  currentFilter.value[key] = value;
  loadMessages(page.value, limit.value, currentFilter.value);
};

const handleAction = (action, messageId) => {
  console.log(`Action: ${action}, Message ID: ${messageId}`);
  // Здесь вы можете добавить логику для обработки действия
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", options);
};

onMounted(() => {
  loadMessages(page.value, limit.value, currentFilter.value);
});
</script>

<style lang="scss">
.table-wrapper {
  overflow-x: auto;
}
.message-buttons {
  display: flex;
  gap: 10px;
}
.message-button {
  border-radius: 14px;
  &-accept {
    background-color: green;
    &:hover {
      background-color: green;
      opacity: 0.8;
    }
  }
  &-decline {
    background-color: red;
    &:hover {
      background-color: red;
      opacity: 0.8;
    }
  }
}
</style>

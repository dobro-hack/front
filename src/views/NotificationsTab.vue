<template>
  <div>
    <h3>Создать уведомление</h3>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Заголовок:</label>
        <input type="text" id="title" v-model="title" required />
      </div>
      <div class="form-group">
        <label for="message">Текст уведомления:</label>
        <textarea id="message" v-model="message" required></textarea>
      </div>
      <button type="submit">Отправить</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { sendNotification } from "@/api/notifications";

const title = ref("");
const message = ref("");

const submitForm = async () => {
  try {
    const response = await sendNotification(title.value, message.value);
    console.log("Уведомление отправлено:", response);
    title.value = "";
    message.value = "";
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
  color: #6d7885;
  font-size: 13px;
}

input,
textarea {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>

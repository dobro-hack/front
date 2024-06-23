<template>
  <div class="notification-form">
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
      <Button type="submit">Отправить</Button>
    </form>
    <SuccessMessageBar
      v-if="showSuccess"
      message="Сообщение успешно отправлено"
      @close="showSuccess = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { sendNotification } from "@/api/notifications";
import SuccessMessageBar from "@/components/SuccessMessageBar.vue";
import Button from "@/components/Button.vue";

const title = ref("");
const message = ref("");
const showSuccess = ref(false);

const submitForm = async () => {
  try {
    const response = await sendNotification(title.value, message.value);
    console.log("Уведомление отправлено:", response);
    title.value = "";
    message.value = "";
    showSuccess.value = true;
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
  }
};
</script>

<style scoped>
.notification-form {
  position: relative;
}

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
</style>

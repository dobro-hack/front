<template>
  <div v-if="show" class="success-message">
    <span>{{ message }}</span>
    <button @click="close">&times;</button>
    <div class="progress-bar" :style="{ width: progressBarWidth + '%' }"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 5000,
  },
});

const emit = defineEmits(["close"]);

const show = ref(true);
const progressBarWidth = ref(100);

const close = () => {
  show.value = false;
  progressBarWidth.value = 100;
  emit("close");
};

const startProgressBar = () => {
  progressBarWidth.value = 100;
  const interval = setInterval(() => {
    progressBarWidth.value -= 2;
    if (progressBarWidth.value <= 0) {
      clearInterval(interval);
      close();
    }
  }, props.duration / 100);
};

watch(show, (newVal) => {
  if (newVal) {
    startProgressBar();
  }
});

onMounted(() => {
  startProgressBar();
});
</script>

<style scoped>
.success-message {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.success-message button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #3c763d;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: #3c763d;
  transition: width 0.1s linear;
}
</style>

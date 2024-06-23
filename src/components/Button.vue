<template>
  <button :class="['btn', buttonType]" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "primary", // primary or secondary
  },
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  emit("click", event);
};

const buttonType = computed(() => {
  return props.type === "primary" ? "btn-primary" : "btn-secondary";
});
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary {
  background-color: #4bb34b;
  color: white;
}

.btn-primary:hover {
  background-color: #3ea73e;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #4bb34b;
}

.btn-secondary:hover {
  background-color: #e5e5e5;
}
</style>

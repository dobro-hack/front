<template>
  <div class="filter-controls">
    <div v-for="filter in filters" :key="filter.key" class="filter-group">
      <label>{{ filter.label }}</label>
      <div class="filter-options">
        <Button
          v-for="option in filter.options"
          :key="option.value"
          :class="{ active: currentFilter[filter.key] === option.value }"
          @click="$emit('update-filter', filter.key, option.value)"
        >
          {{ option.text }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import Button from "./Button.vue";

const props = defineProps({
  filters: {
    type: Array,
    required: true,
  },
  currentFilter: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.filter-controls {
  margin-bottom: 1em;
  display: flex;
  gap: 10px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.5em;
}

.filter-options {
  display: flex;
  gap: 5px;
}

.filter-options button {
  background: none;
  border: none;
  padding: 0.5em 1em;
  cursor: pointer;
  color: #4bb34b;
  border-radius: 4px;
}

.filter-options button.active {
  background-color: #4bb34b;
  color: white;
}
</style>

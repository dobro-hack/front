<template>
  <div class="pagination-controls" v-if="totalPages > 1">
    <button v-if="page !== 1" @click="$emit('prev-page')" class="arrow">
      &larr;
    </button>
    <span v-for="p in totalPages" :key="p">
      <button @click="$emit('set-page', p)" :class="{ active: p === page }">
        {{ p }}
      </button>
    </span>
    <button
      v-if="page !== totalPages"
      @click="$emit('next-page')"
      class="arrow"
    >
      &rarr;
    </button>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.pagination-controls button {
  background: none;
  border: none;
  margin: 0 0.25em;
  font-size: 12px;
  cursor: pointer;
  color: #007bff;
  padding: 7.5px 12px;
}

.pagination-controls button.active {
  background-color: #007bff;
  color: white;
  border-radius: 4px;
}

.pagination-controls button.arrow {
  color: #007bff;
  font-size: 18px;
}

.pagination-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  font-size: 18px;
}
</style>

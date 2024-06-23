<template>
  <div class="no-records-found">
    {{ message }}
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.no-records-found {
  text-align: center;
  padding: 20px 0;
  font-size: 18px;
  color: #666;
}
</style>

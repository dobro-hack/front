<template>
  <div class="route-details">
    <img
      v-if="route.route_photo && route.route_photo.length"
      :src="route.route_photo && route.route_photo[0]"
      class="route-image"
    />
    <div>
      <div>{{ route.route_name }}</div>
      <div class="park-name">{{ route.park_name }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.route-details {
  display: flex;
  align-items: center;
  text-align: left;
}

.route-image {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  margin-right: 10px;
}

.park-name {
  color: #6c757d;
  font-size: 12px;
}
</style>

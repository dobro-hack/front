<template>
  <div>
    <div id="map" style="height: 500px"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import L from "leaflet";

export default {
  setup() {
    const map = ref(null);

    const initializeMap = () => {
      map.value = L.map("map").setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map.value);

      // Пример данных
      const data = [
        { lat: 51.5, lng: -0.09, load: 50 },
        { lat: 51.51, lng: -0.1, load: 70 },
      ];

      data.forEach((point) => {
        L.circle([point.lat, point.lng], {
          color: point.load > 60 ? "red" : "green",
          radius: 500,
        }).addTo(map.value);
      });
    };

    onMounted(() => {
      initializeMap();
    });

    return {
      map,
    };
  },
};
</script>

<style>
#map {
  height: 500px;
}
</style>

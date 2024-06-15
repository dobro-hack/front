<template>
  <div id="map" style="width: 100%; height: 600px"></div>
</template>

<script setup>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";

onMounted(() => {
  const map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);

  const gpxFiles = [
    "/assets/maps/pinachevo.gpx",
    //"/assets/maps/vulkashiki.gpx",
  ];

  const bounds = L.latLngBounds();

  let loadedCount = 0;

  gpxFiles.forEach((gpxFile) => {
    new L.GPX(gpxFile, {
      async: true,
      marker_options: {
        shadowUrl: null,
      },
    })
      .on("loaded", function (e) {
        bounds.extend(e.target.getBounds());
        loadedCount++;

        if (loadedCount === gpxFiles.length) {
          map.fitBounds(bounds);
        }
      })
      .addTo(map);
  });
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 600px;
}
</style>

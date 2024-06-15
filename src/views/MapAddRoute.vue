<template>
  <div id="map" style="width: 100%; height: 600px"></div>
  <button @click="saveRoute">Сохранить маршрут</button>
</template>

<script setup>
import { onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

const route = ref([]);
const drawnItems = new L.FeatureGroup();
let map;

onMounted(() => {
  // Центрируем карту на координатах 57° с. ш. и 160° в. д.
  const centerCoordinates = [57, 160];
  map = L.map("map").setView(centerCoordinates, 13).setZoom(5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    draw: {
      polygon: false,
      marker: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
      polyline: true,
    },
    edit: {
      featureGroup: drawnItems,
      edit: true,
      remove: true,
    },
  });

  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    route.value.push(layer);
    drawnItems.addLayer(layer);

    layer.on("click", function () {
      layer.editing.enable();
    });
  });

  map.on(L.Draw.Event.EDITED, function (event) {
    const layers = event.layers;
    layers.eachLayer(function (layer) {
      const index = route.value.findIndex(
        (r) => r._leaflet_id === layer._leaflet_id
      );
      if (index !== -1) {
        route.value[index] = layer;
      }
    });
  });

  map.on(L.Draw.Event.DELETED, function (event) {
    const layers = event.layers;
    layers.eachLayer(function (layer) {
      const index = route.value.findIndex(
        (r) => r._leaflet_id === layer._leaflet_id
      );
      if (index !== -1) {
        route.value.splice(index, 1);
      }
    });
  });

  drawnItems.eachLayer(function (layer) {
    layer.on("click", function () {
      layer.editing.enable();
    });
  });
});

const saveRoute = () => {
  const gpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Leaflet" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>My Route</name>
    <trkseg>
      ${route.value
        .flatMap((layer) => layer.getLatLngs())
        .map((point) => `<trkpt lat="${point.lat}" lon="${point.lng}"></trkpt>`)
        .join("\n")}
    </trkseg>
  </trk>
</gpx>`;

  const blob = new Blob([gpxData], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "route.gpx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 600px;
}
button {
  margin: 5px;
}
</style>

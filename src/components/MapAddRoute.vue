<template>
  <div>
    <div id="edit-map" style="width: 100%; height: 300px"></div>
    <label class="custom-file-upload">
      <input type="file" @change="handleFileUpload" />
      <div class="upload-container">
        <div class="upload-icon">+</div>
        <div class="upload-text">
          <div class="upload-main-text">Загрузить файл маршрута</div>
          <div class="upload-subtext">формат: gpx</div>
        </div>
      </div>
    </label>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import simplify from "simplify-path";

const props = defineProps(["route"]);
const emit = defineEmits(["update-gpx-data"]);
const route = ref([]);
const drawnItems = new L.FeatureGroup();
let map;
const gpxFile = ref(null);
const firstFit = ref(false);

const tolerance = 0.0001; // Настройте значение tolerance для уменьшения количества точек

onMounted(() => {
  const centerCoordinates = [57, 160];
  map = L.map("edit-map").setView(centerCoordinates, 13).setZoom(5);

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
    updateGpxData();
  });

  map.on(L.Draw.Event.EDITVERTEX, function () {
    updateGpxData();
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
    updateGpxData();
  });

  drawnItems.eachLayer(function (layer) {
    layer.on("click", function () {
      layer.editing.enable();
    });
  });
});

const updateGpxData = () => {
  const gpxData = `<?xml version="1.0" encoding="UTF-8"?>
  <gpx version="1.1" creator="Leaflet" xmlns="http://www.topografix.com/GPX/1/1">
    <trk>
      <name>${route.name}</name>
      <trkseg>
        ${route.value
          .flatMap((layer) => layer.getLatLngs())
          .map(
            (point) => `<trkpt lat="${point.lat}" lon="${point.lng}"></trkpt>`
          )
          .join("\n")}
      </trkseg>
    </trk>
  </gpx>`;
  console.warn("gpxData", gpxData);
  emit("update-gpx-data", gpxData);
};

watch(
  () => props.route.gpx_data,
  (newGpxData) => {
    if (!newGpxData) return;

    drawnItems.clearLayers();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(newGpxData, "text/xml");
    const latlngs = Array.from(xmlDoc.getElementsByTagName("trkpt")).map(
      (trkpt) => {
        const lat = parseFloat(trkpt.getAttribute("lat"));
        const lon = parseFloat(trkpt.getAttribute("lon"));
        return [lat, lon];
      }
    );

    const polyline = new L.Polyline(latlngs, {
      color: "blue",
      weight: 3,
    }).addTo(drawnItems);

    if (polyline._latlngs.length === 0) return;

    if (!firstFit.value) {
      setTimeout(() => {
        map.fitBounds(polyline.getBounds());
        firstFit.value = true;
      }, 0);
    }
    polyline.editing.enable();
    route.value = [polyline];
  },
  { immediate: true }
);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.name.includes("gpx")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
      const latlngs = Array.from(xmlDoc.getElementsByTagName("trkpt")).map(
        (trkpt) => {
          const lat = parseFloat(trkpt.getAttribute("lat"));
          const lon = parseFloat(trkpt.getAttribute("lon"));
          return [lat, lon];
        }
      );
      const simplifiedLatLngs = simplify(latlngs, tolerance);
      const polyline = new L.Polyline(simplifiedLatLngs, {
        color: "blue",
        weight: 3,
      }).addTo(drawnItems);

      map.fitBounds(polyline.getBounds());
      polyline.editing.enable();
      route.value = [polyline];
      updateGpxData();
    };
    reader.readAsText(file);
    gpxFile.value = file;
  } else {
    alert("Please upload a valid GPX file.");
  }
};
</script>

<style>
#edit-map {
  width: 100%;
  height: 600px;
}

.custom-file-upload {
  display: inline-block;
  cursor: pointer;
}

.upload-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 10px;
}

.upload-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  font-size: 24px;
  color: #4bb34b;
  background: #f5f5f5;
  border-radius: 50%;
}

.upload-text {
  display: flex;
  flex-direction: column;
  color: #3f8ae0;
}

.upload-main-text {
  font-size: 16px;
  font-weight: bold;
}

.upload-subtext {
  font-size: 12px;
  color: #999;
}

input[type="file"] {
  display: none;
}

.leaflet-div-icon {
  width: 14px !important;
  height: 14px !important;
  margin-left: -7px !important;
  margin-top: -7px !important;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: blue;
}
</style>

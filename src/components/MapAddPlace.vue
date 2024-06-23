<template>
  <div>
    <div id="map" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

// Импорт изображения маркера
import pinIcon from "../assets/pin-icon-start.png";

const props = defineProps(["route", "initialLocation"]);
const emit = defineEmits(["add-place"]);
const drawnItems = new L.FeatureGroup();
let map;
let marker;

const customIcon = L.icon({
  iconUrl: pinIcon,
  iconSize: [22, 32], // Размер иконки, можно настроить по вашему усмотрению
  iconAnchor: [11, 32], // Точка привязки иконки, центр по горизонтали и низ по вертикали
  shadowUrl: null, // Убираем тень
});

onMounted(() => {
  const centerCoordinates = [57, 160];
  map = L.map("map").setView(centerCoordinates, 13).setZoom(5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    draw: {
      polygon: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
      marker: true,
      polyline: false,
    },
    edit: {
      featureGroup: drawnItems,
      edit: false,
      remove: true,
    },
  });

  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);

    if (layer instanceof L.Marker) {
      const latLng = layer.getLatLng();
      emit("add-place", { lat: latLng.lat, lon: latLng.lng });
      if (marker) {
        marker.off("dragend", onDragEnd);
        map.removeLayer(marker);
      }
      marker = layer;
      marker.setIcon(customIcon);
      marker.on("dragend", onDragEnd);
    }
  });

  const onDragEnd = (e) => {
    const latLng = e.target.getLatLng();
    emit("add-place", { lat: latLng.lat, lon: latLng.lng });
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

      map.fitBounds(polyline.getBounds());
    },
    { immediate: true }
  );

  watch(
    () => props.initialLocation,
    (newLocation) => {
      if (newLocation) {
        const location = newLocation;
        if (marker) {
          map.removeLayer(marker);
        }
        marker = L.marker([location.lat, location.lon], {
          draggable: true,
          icon: customIcon,
        }).addTo(map);
        map.setView([location.lat, location.lon], 13);
        marker.on("dragend", function (e) {
          const latLng = e.target.getLatLng();
          if (!latLng.lat) return;
          emit("add-place", { lat: latLng.lat, lon: latLng.lng });
        });
      }
    },
    { immediate: true }
  );
});
</script>

<style>
#map {
  width: 100%;
  height: 400px;
}
</style>

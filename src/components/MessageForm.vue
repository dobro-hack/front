<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">&times;</button>
      <h3 class="modal-title">
        Текст обращения: {{ message.message_content }}
      </h3>
      <h4 class="modal-subtitle">
        Тип проблемы: {{ translateMessageType(message.message_type) }}
      </h4>
      <div class="modal-body">
        <div id="map" style="width: 100%; height: 300px"></div>
        <div class="modal-image-container">
          <img
            :src="'https://syomka.tech/' + message.message_file_url"
            alt="Attached Image"
            class="modal-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import messageTypeFullTranslations from "@/constants/messageTypeFullTranslations";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["close"]);

const map = ref(null);
const marker = ref(null);

const closeModal = () => {
  emits("close");
};

const initializeMap = (location) => {
  if (!map.value) {
    map.value = L.map("map").setView([location.Lat, location.Lon], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map.value
    );
  } else {
    map.value.setView([location.Lat, location.Lon], 13);
  }

  if (marker.value) {
    map.value.removeLayer(marker.value);
  }

  const customIcon = L.icon({
    iconUrl: "https://syomka.tech/" + props.message.message_file_url,
    iconSize: [64, 64], // Adjust icon size
    iconAnchor: [32, 64], // Adjust icon anchor
  });

  marker.value = L.marker([location.Lat, location.Lon], {
    icon: customIcon,
  }).addTo(map.value);
};

watch(
  () => props.message,
  (newMessage) => {
    if (newMessage && newMessage.message_location) {
      const location = newMessage.message_location;
      initializeMap(location);
    }
  }
);

onMounted(() => {
  if (props.message && props.message.message_location) {
    const location = props.message.message_location;
    initializeMap(location);
  }
});

const translateMessageType = (type) => {
  return messageTypeFullTranslations[type] || type;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 800px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image-container {
  margin-top: 20px;
}

.modal-image {
  max-width: 80%;
  height: auto;
  border-radius: 8px;
}

.modal-title {
  font-size: 20px;
  margin-bottom: 12px;
}

.modal-subtitle {
  font-size: 16px;
  margin-bottom: 8px;
}
</style>

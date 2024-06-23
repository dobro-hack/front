<template>
  <div class="form-popup">
    <div class="form-popup-content">
      <div class="form-popup-header">
        <h3>
          {{ formPlace.id ? "Редактировать место" : "Добавить новое место" }}
        </h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <form @submit.prevent="submitForm" class="form-grid">
        <div class="form-check">
          <input
            type="checkbox"
            id="calc"
            v-model="formPlace.used_in_calculations"
          />
          <label for="calc"> Используется в расчетах: </label>
        </div>
        <div class="form-group">
          <label>Название:</label>
          <input type="text" v-model="formPlace.name" required />
        </div>
        <div class="form-group">
          <label>Описание:</label>
          <textarea v-model="formPlace.description" required></textarea>
        </div>
        <div class="form-group">
          <label>Иконка:</label>
          <div class="form-group-with-icon">
            <select v-model="formPlace.icon">
              <option
                v-for="icon in icons"
                :key="icon.value"
                :value="icon.value"
              >
                <span>{{ icon.label }}</span>
              </option>
            </select>
            <img :src="formPlace.icon" />
          </div>
        </div>
        <template v-if="formPlace.used_in_calculations">
          <div class="form-group">
            <label>Площадь (кв. м):</label>
            <input
              type="number"
              v-model.number="formPlace.area"
              required
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label>Площадь на посетителя (кв. м):</label>
            <input
              type="number"
              v-model.number="formPlace.area_per_visitor"
              required
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label>Коэффициент возвращения:</label>
            <input
              type="number"
              v-model.number="formPlace.return_coefficient"
              required
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label>Дни:</label>
            <input
              type="number"
              v-model.number="formPlace.days"
              required
              step="0.01"
            />
          </div>
        </template>

        <div class="form-group full-width">
          <MapAddPlace
            @add-place="addPlaceCoordinates"
            :route="route"
            :initialLocation="formPlace.location"
          />
        </div>
        <div class="form-group full-width">
          <button type="submit">
            {{ formPlace.id ? "Обновить место" : "Добавить место" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import MapAddPlace from "./MapAddPlace.vue";

const props = defineProps({
  place: Object,
  routeId: Number,
  route: Object,
});

const emits = defineEmits(["submit", "close"]);

const formPlace = ref({
  ...props.place,
  used_in_calculations: props.place.used_in_calculations === 1,
});

const icons = [
  { value: "http://syomka.tech/files/car_outline_28.svg", label: "Парковка" },
  {
    value: "http://syomka.tech/files/info_circle_outline_28.svg",
    label: "Информация",
  },
  {
    value: "http://syomka.tech/files/phone_wave_outline_28.svg",
    label: "Телефон",
  },
  {
    value: "http://syomka.tech/files/delete_outline_28.svg",
    label: "Мусорный бак",
  },
  { value: "http://syomka.tech/files/toilet.svg", label: "Туалет" },
];

watch(props, (newProps) => {
  formPlace.value = {
    ...newProps.place,
    used_in_calculations: newProps.place.used_in_calculations === 1,
  };
});

const addPlaceCoordinates = ({ lat, lon }) => {
  formPlace.value.location = { lat, lon };
};

const submitForm = () => {
  const placeData = {
    ...formPlace.value,
    route_id: props.routeId,
    used_in_calculations: formPlace.value.used_in_calculations ? 1 : 0,
    location: formPlace.value.location,
  };
  emits("submit", placeData);
};
</script>

<style scoped>
.form-popup {
  position: fixed;
  right: 0;
  top: 0;
  width: 800px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
}

.form-popup-content {
  padding: 20px;
}

.form-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
}

.form-check {
  grid-column: span 2;
  display: flex;
  align-items: center;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group-with-icon {
  display: flex;
  align-items: center;
  gap: 1em;
}

.form-group-with-icon img {
  width: 40px;
  height: 40px;
}

.full-width {
  grid-column: span 2;
}

label {
  color: #6d7885;
  font-size: 13px;
}

input:not([type="checkbox"]),
select,
textarea {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>

<template>
  <div class="custom-select" @click="toggleDropdown">
    <div class="custom-select-label">{{ selectedLabel }}</div>
    <span class="custom-select-arrow">&#9662;</span>
    <div v-if="isDropdownOpen" class="custom-select-dropdown">
      <div
        v-for="option in options"
        :key="option.value"
        :class="[
          'custom-select-option',
          { selected: option.value === modelValue },
        ]"
        @click="selectOption(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  onBeforeUnmount,
} from "vue";

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emits = defineEmits(["update:modelValue"]);

const isDropdownOpen = ref(false);

const selectedLabel = computed(() => {
  const selectedOption = props.options.find(
    (option) => option.value === props.modelValue
  );
  return selectedOption ? selectedOption.label : "Выберите";
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectOption = (value) => {
  emits("update:modelValue", value);
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".custom-select")) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.custom-select {
  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
  margin-right: 10px;
}

.custom-select-label {
  display: block;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 20px;
  text-align: center;
  font-size: 16px;
  color: #4bb34b;
  padding-right: 40px;
}

.custom-select-arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  pointer-events: none;
}

.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.custom-select-option {
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.custom-select-option:hover,
.custom-select-option.selected {
  background: #4bb34b;
  color: white;
}
</style>

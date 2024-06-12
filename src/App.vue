<template>
  <div class="root">
    <div class="header"></div>
    <div class="wrapper">
      <div class="tabs">
        <router-link
          v-for="tab in tabs"
          :key="tab.value"
          :to="tab.value"
          :class="{ 'tab-link': true }"
        >
          {{ tab.label }}
        </router-link>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
const tabs = [
  { label: "Заявки", value: "requests" },
  { label: "Сообщения от посетителей", value: "visitor-messages" },
  { label: "Проблемы со спутника", value: "satellite-issues" },
  { label: "Маршруты", value: "routes" },
  { label: "Роли", value: "roles" },
];
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}

html,
body {
  height: 100%;
}

#app {
  height: 100%;
}

.root {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
}

body {
  background: #ebedf0;
}

.header {
  background: #fff;
  width: 100%;
  height: 52px;
  margin-bottom: 8px;
}

.wrapper {
  width: 1024px;
  margin: 0 auto;
  flex: 0 0 auto;
}

.content {
  width: 100%;
  background: #fff;
  padding: 8px 0px 8px 0px;
  gap: 0px;
  border-radius: 16px;
  opacity: 0px;
  padding: 8px 16px;
}

.tabs {
  display: flex;
  margin: 8px 0;
}

.tab-link {
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.tab-link.router-link-active {
  background-color: #ffffff;
  color: #28a745;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.tab-link:hover {
  color: #28a745;
}
</style>

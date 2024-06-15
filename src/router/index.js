import { createRouter, createWebHashHistory } from "vue-router";
import RequestsTab from "../views/RequestsTab.vue";
import MessagesTab from "../views/MessagesTab.vue";
import SatelliteIssuesTab from "../views/SatelliteIssuesTab.vue";
import RoutesTab from "../views/RoutesTab.vue";
import CapacityTab from "../views/CapacityTab.vue";

const routes = [
  {
    path: "/",
    redirect: "requests",
  },
  {
    path: "/requests",
    name: "requests",
    component: RequestsTab,
  },
  {
    path: "/messages",
    name: "messages",
    component: MessagesTab,
  },
  {
    path: "/satellite",
    name: "satellite",
    component: SatelliteIssuesTab,
  },
  {
    path: "/routes",
    name: "routes",
    component: RoutesTab,
  },
  {
    path: "/capacity",
    name: "capacity",
    component: CapacityTab,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "/requests",
    component: RequestsTab,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

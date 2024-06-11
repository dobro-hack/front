import { createRouter, createWebHashHistory } from "vue-router";
import RequestsTab from "../views/RequestsTab.vue";
import MessagesTab from "../views/MessagesTab.vue";
import SatelliteIssuesTab from "../views/SatelliteIssuesTab.vue";
import RoutesTab from "../views/RoutesTab.vue";
import RolesTab from "../views/RolesTab.vue";

const routes = [
  {
    path: "/requests",
    name: "requests",
    component: RequestsTab,
  },
  {
    path: "/visitor-messages",
    name: "visitor-messages",
    component: MessagesTab,
  },
  {
    path: "/satellite-issues",
    name: "satellite-issues",
    component: SatelliteIssuesTab,
  },
  {
    path: "/routes",
    name: "routes",
    component: RoutesTab,
  },
  {
    path: "/roles",
    name: "roles",
    component: RolesTab,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

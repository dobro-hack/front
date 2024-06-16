<template>
  <div>
    <line-chart :chart-data="chartData" :options="chartOptions"></line-chart>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default {
  components: {
    LineChart: Line,
  },
  props: {
    load: {
      type: Array,
      required: true,
    },
    maxLoad: {
      type: Array,
      required: true,
    },
  },
  computed: {
    chartData() {
      return {
        labels: Array.from({ length: 366 }, (_, i) => i + 1),
        datasets: [
          {
            label: "Load",
            backgroundColor: "#42A5F5",
            data: this.load,
          },
          {
            label: "Max Load",
            backgroundColor: "#FF6384",
            data: this.maxLoad,
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Day of the Year",
            },
          },
          y: {
            title: {
              display: true,
              text: "Load",
            },
          },
        },
      };
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
}
</style>

<script>
import { Line } from 'vue-chartjs';
export default {
  extends: Line,
  props: {
    chartData: {
      type: Array,
      required: false,
      default: () => [],
    },
    chartLabels: {
      type: Array,
      required: true,
    },
    optionStyle: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: this.optionStyle.ticksY,
            },
            gridLines: {
              display: this.optionStyle.gridLinesY,
            },
          }],
          xAxes: [{
            gridLines: {
              display: this.optionStyle.gridLinesX,
            },
          }],
        },
        legend: {
          display: this.optionStyle.legend,
        },
        responsive: this.optionStyle.responsive,
        maintainAspectRatio: this.optionStyle.maintainAspectRatio,
      },
    };
  },
  mounted() {
    this.renderChart({
      labels: this.chartLabels,
      datasets: [
        {
          label: this.optionStyle.label,
          borderColor: this.optionStyle.borderColor,
          pointBackgroundColor: this.optionStyle.pointBackgroundColor,
          borderWidth: this.optionStyle.borderWidth,
          pointBorderColor: this.optionStyle.pointBorderColor,
          backgroundColor: this.optionStyle.backgroundColor,
          data: this.chartData,
        },
      ],
    }, this.options);
  },
};
</script>

<template>
  <div
      :id="id"
      :style="{ height: 250 + 'px', marginTop: 0 + 'px' }">
  </div>
</template>

<script>

const uuid = require("uuid");

export default {
  props: ['title', 'percent'],
  name: "SysCpuChart",
  data() {
    return {
      id: uuid.v1(),
      myChart: null,

    }
  },
  watch: {
    percent() {
      this.myChart.resize()
      this.draw()
    }
  },
  mounted() {
    let el = document.getElementById(this.id);
    this.myChart = this.$echarts.init(el);
    window.onresize = this.myChart.resize;
    this.draw()
  },
  methods: {
    draw() {
      let option = {
        title: {
          text: this.title,
          subtext: '',
          left: 'center'
        },
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 10
            },
            axisLine: {
              lineStyle: {
                width: 10,
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              length: 5,
              lineStyle: {
                width: 1,
                color: '#999'
              }
            },
            axisLabel: {
              distance: 12,
              color: '#999',
              fontSize: 10
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 4,
              itemStyle: {
                borderWidth: 10
              }
            },
            detail: {
              valueAnimation: true,
              fontSize: 20,
              offsetCenter: [0, '70%']
            },
            data: [
              {
                value: this.percent
              }
            ]
          }
        ]
      };
      this.myChart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>

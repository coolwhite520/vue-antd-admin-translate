<template>
  <div
      :id="id"
      :style="{ height: 250 + 'px', marginTop: 0 + 'px',}">
  </div>
</template>

<script>

const uuid = require("uuid");

export default {
  props: ['title', 'percent'],
  name: "SysPieChart",
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
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: this.title,
            type: 'pie',
            radius: '50%',
            data: [
              { value: this.percent, name: "占用" + this.percent + "%" },
              { value: 100 - this.percent, name: "空闲" + (100 - this.percent) + "%" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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

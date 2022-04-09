<template>
  <div
      :id="id"
      :style="{ height: 250 + 'px', marginTop: 0 + 'px' }">
  </div>
</template>

<script>

const uuid = require("uuid");

export default {
  props: ['title', 'io_read_bytes', "io_write_bytes", "io_read_bytes_str", "io_write_bytes_str"],
  name: "SysBarChat",
  data() {
    return {
      id: uuid.v1(),
      myChart: null,

    }
  },
  watch: {
    io_read_bytes() {
      this.myChart.resize();
      this.draw()
    },
    io_write_bytes() {
      this.myChart.resize();
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
        xAxis: {
          type: 'category',
          data: ['读:' + this.io_read_bytes_str + '/秒', '写:' + this.io_write_bytes_str + '/秒' ]
        },
        yAxis: {
          show: false,
          type: 'value',
        },
        series: [
          {
            barWidth: "20%",
            data: [this.io_read_bytes, this.io_write_bytes,],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
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

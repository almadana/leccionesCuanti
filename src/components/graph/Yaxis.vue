<template>
  <g class="hlines">
    <path :d="`M ${x_min} ${y_min} L ${x_min} ${y_max}`" :stroke-width="stroke_width" :stroke="stroke" />
    <text dx="-3" dy="2" v-for="(tick, i) in ticks" :key="i" class="tick" :x="x_min-tick_size" :y="y_max-i*gap" >{{tick}}</text>
  </g>
</template>

<script>

export default {
  name: 'hlines',
  props: {
    frame: String,
    gap: {
      type: Number,
      default: 10
    },
    tick_size: {
      type: Number,
      default: 2
    },
    stroke_width: {
      type: Number,
      default: 0.5 
    },
    stroke: {
      type: String,
      default: "grey"
    },
    labels: Array
  },
  computed: {
    coords: function() {
      return this.frame.split(" ").map(x=>parseInt(x));
    },
    x_min: function() {
      return this.coords[0]
    },
    y_min: function() {
      return this.coords[1]
    },
    x_max: function() {
      return this.coords[2]
    },
    y_max: function() {
      return this.coords[3]
    },
    n_lines: function() {
      var width = this.x_max - this.x_min;
      var n = Math.floor(width/this.gap)+1
      return Array(n).keys()
    },
    n_ticks: function() {
      var width = this.x_max - this.x_min;
      var n = Math.floor(width/this.gap)
      var marks = Array.from(Array(n).keys());
      return marks
    },
    ticks: function() {
      return this.labels||this.n_ticks
    }
  }
}
</script>

<style scoped lang="scss">
text {
  font-size: 0.4em;
  text-anchor: middle;
}
</style>

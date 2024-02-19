<template>
  <g class="hlines">
    <path class="axis xaxis" :d="`M ${x_min} ${y_max} L ${x_max} ${y_max}`" :stroke-width="stroke_width" :stroke="stroke"/>
    <text dy="5" v-for="(tick, i) in ticks" :key="i" class="tick" :x="(i)*gap+x_min" :y="y_max+tick_size" >{{tick}}</text>
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

path.tick {
  stroke: grey;
  stroke-width: 0.5;
}

text {
  font-size: 0.4em;
  text-anchor: middle;
}
</style>

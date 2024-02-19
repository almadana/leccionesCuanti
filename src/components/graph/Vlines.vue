<template>
  <g class="hlines">
    <path v-for="i in n_lines" :key="i"
      class="hline"
      :d="`M ${i*_gap+x_min} ${y_min} L ${i*_gap+x_min} ${y_max}`"
      :stroke-width="stroke_width"
      :stroke="stroke"
    />
  </g>
</template>

<script>

export default {
  name: 'hlines',
  props: {
    frame: String,
    gap: Number,
    delta: {
      type: Number,
      default: 10
    },
    max: Number,
    min: {
      type: Number,
      default: 0
    },
    scale: {
      type: Array,
      default: ()=>[1,1]
    },
    stroke_width: {
      type: Number,
      default: 0.5 
    },
    stroke: {
      type: String,
      default: "grey"
    }
  },
  computed: {
    coords: function() { return this.frame.split(" ").map(x=>parseInt(x)); },
    x_min: function() { return this.coords[0] },
    y_min: function() { return this.coords[1] },
    x_max: function() { return this.coords[2] },
    y_max: function() { return this.coords[3] },
    width: function() { return this.x_max-this.x_min },
    n_lines: function() {
      var n = Math.floor(this.width/this._gap)+1
      return Array(n).keys()
    },
    _gap: function() {
      var output = this.gap||(this.scale[0]*this.delta)
      return output
    }
  }
}
</script>

<style scoped lang="scss">
path {
  stroke: grey;
  stroke-width: 0.5;
}
</style>

<template>
  <g :transform="`translate(${text_x-width},${text_y})`">
  <rect :width="width" :height="height+ymargin"  class="legend" />
    <g :transform="`translate(${xmargin},${ymargin})`">
      <g v-for="(label, i) in labels" :key="i" :transform="`translate(${0},${rect_height*i*1.2})`" class="row" >
        <rect :width="rect_width" :height="rect_height"  :class="'group_bar_'+i" :transform="`translate(${0},${0})`"/>
        <text :transform="`translate(${rect_width+xmargin},${rect_height*0.8})`" >{{label}}</text>
      </g>
    </g>
  </g>
</template>

<script>

export default {
  name: 'glegend',
  props: {
    frame: String,
    labels: {
      type: Array,
      default: ()=>[]
    },
    xmargin: {
      type: Number,
      default: 2
    },
    ymargin: {
      type: Number,
      default: 2
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
  },
  data: function() {
    return {
      rect_width: 10,
      rect_height: 10,
    }
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
    text_x: function() {
      return this.x_max;
    },
    text_y: function() {
      return this.y_min;
    },
  }
}
</script>

<style scoped lang="scss">
text {
  font-size: 8px;
  text-anchor: start;
  alignment-baseline: central;
}

.group_bar_0 { fill: $color_0; }
.group_bar_1 { fill: $color_1; }
.group_bar_2 { fill: $color_2; }

.legend {
  fill: white;
  stroke: black;
  stroke-width: 0.5;
}
</style>

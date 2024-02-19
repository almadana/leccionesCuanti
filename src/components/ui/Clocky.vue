<template>
  <g :transform="`rotate(-90, ${cx}, ${cy})`">
    <path :fill="arc_color" :fill-opacity="fill_opacity" stroke="black" stroke-width="0.2" :d="arc()"/>
  </g>
</template>

<script>
export default {
  props: {
    frame: String,
    cx: {
      type: Number,
      default: 5
    },
    cy: {
      type: Number,
      default: 5
    },
    hours: {
      type: Number,
      default: 0.5,
    },
    fill_color: {
      type: String,
      default: "none"
    },
    fill_opacity: {
      type: Number,
      default: 0.5
    },
    arc_color: {
      type: String,
      default: "darkred"
    },
    radius: {
      type: Number,
      default: 3.5,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 12,
    },

  },
  methods: {
    arc: function() {
      var ratio = (this.hours-this.min)/this.max;
      var Tau = Math.PI*2;
      var theta = -Tau*ratio;
      var x1 = this.cx+this.radius*Math.cos(theta);
      var y1 = this.cy-this.radius*Math.sin(theta);
      var x2 = this.cx+this.radius*Math.cos(theta/2);
      var y2 = this.cy-this.radius*Math.sin(theta/2);

      var output = `M ${x1} ${y1} A${this.radius},${this.radius} 0 0,0 ${x2},${y2} A${this.radius},${this.radius} 0 0,0 ${this.cx+this.radius},${this.cy} h -${this.radius} z`;
      return output
    }
  },
}
</script>

<style lang="scss">
</style>

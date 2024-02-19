<template>
  <g :transform="`translate(0, ${margin})`" >
    <text :x="text_x" :y="text_y" :dy="dy" >{{text}}</text>
  </g>
</template>

<script>

export default {
  name: 'hlines',
  props: {
    frame: String,
    text: {
      type: String,
      default: ""
    },
    dy: {
      type: Number,
      default:5 
    },
    gap: {
      type: Number,
      default: 0
    },
    margin: {
      type: Number,
      default: 0
    },
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
      return (this.x_max-this.x_min)/2;
    },
    text_y: function() {
      return this.y_max;
    },
  }
}
</script>

<style scoped lang="scss">
text {
  font-size: 12px;
  text-anchor: middle;
}
</style>

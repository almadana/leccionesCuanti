<template>
  <g :transform="`translate(${-margin},${0})`" >
    <text :transform="`translate(${text_x},${text_y})rotate(-90)`" dy="5" >{{text}}</text>
  </g>
</template>

<script>

export default {
  name: 'ytitle',
  props: {
    frame: String,
    text: {
      type: String,
      default: ""
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
      return this.x_min
    },
    text_y: function() {
      return (this.y_max-this.y_min)/2;
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

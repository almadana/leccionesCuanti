<template>
  <g>
    <text :x="text_x" :y="text_y" >{{text}}</text>
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
      return this.y_min-this.margin;
    },
  }
}
</script>

<style scoped lang="scss">
text {
  font-size: 15px;
  text-anchor: middle;
}
</style>

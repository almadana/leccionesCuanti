<template>
  <g :transform="`translate(${0},${0})`" >
    <g v-for="(label, index) in labels" :key="index" :transform="`translate(${x_min-margin},${ypos(y_max, thick, gap, index)})`">",
      <text :transform="`rotate(-90)`" >{{label}}</text>
    </g>
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
    labels: {
      type: Array,
      default: ()=>[]
    },
    gap: {
      type: Number,
      default: 0
    },
    thick: {
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
  },
  methods: {
    ypos: function(max, thick, gap, n) {
      var output = max-n*(thick+gap)-thick/2
      return output
    }
  }
}
</script>

<style scoped lang="scss">
text {
  font-size: 10px;
  text-anchor: middle;
}
</style>

<template>
  <g>
    <g v-for="(cvalues,index) in values" :key="index" :transform="translate(index)">
      <StackedBar :orientation="orientation" :alignment="alignment" :size="size" :thickness="thickness" :bar_data="cvalues" :scale="scale"/>
    </g>
  </g>
</template>

<script>

export default {
  name: 'multibars',
  props: {
    groups: Array,
    values: Array,
    size: Number,
    scale: Number,
    thickness: Number,
    frame: String,
    orientation: {
      type: String,
      default: "horizontal"
    },
    alignment: {
      type: String,
      default: "start"
    },
    gap: {
      type: Number,
      default: 10
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
  },
  methods: {
    translate: function(index) {
      var output = "";
      if (this.orientation=="horizontal") {
        output = `translate(${this.x_min},${this.y_max-index*(this.thickness+this.gap)-this.thickness})`
      } else {
        output = `translate(${this.x_min+index*(this.thickness+this.gap)},${this.y_min})`
      }
      return output
    },
  }
}
</script>

<style scoped lang="scss">
</style>

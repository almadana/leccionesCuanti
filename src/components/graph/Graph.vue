<template>
  <div>
    <svg :viewBox="viewbox" :width="width" :height="height" :preserveAspectRatio="preserveAspectRatio" >
      <slot :frame="frame" :canvas="canvas" :margin="margin" :x_gap="x_gap" :y_gap="y_gap" :scale="[ux_rate, vy_rate]"></slot>
    </svg>
  </div>
</template>

<script>

export default {
  name: 'viewbox',
  props: {
    coords: {
      type: Array,
      default: ()=>[0, 0, 300, 300]
    },
    domain: {
      type: Array,
      default: ()=>[0, 0, 300, 300]
    },
    width: {
      type: String,
      default: "100%"
    },
    height: String,
    preserveAspectRatio: {
      type: String,
      default: "xMinYMax meet"
    },
    margin: {
      type: Array,
      default: ()=>[10, 10, 10, 10]
    },
    padding: {
      type: Array,
      default: ()=>[0, 0, 0, 0]
    },
    grid: {
      type: Array,
      default: ()=>[10, 10]
    }
  },
  computed: {
    viewbox: function() { return this.coords.join(' ')},

    x_gap: function() { return this.grid[0]*this.ux_rate },
    y_gap: function() { return this.grid[1]*this.vy_rate },

    frame: function() { 
      var output = [];
      output[0] = this.coords[0]+this.margin[0];
      output[1] = this.coords[1]+this.margin[1];
      output[2] = this.coords[2]-this.margin[2];
      output[3] = this.coords[3]-this.margin[3];

      return output.join(" ")
    },
    canvas: function() { 
      var output = [];
      output[0] = this.coords[0]+this.margin[0] + this.padding[0];
      output[1] = this.coords[1]+this.margin[1] + this.padding[1];
      output[2] = this.coords[2]-this.margin[2] - this.padding[2];
      output[3] = this.coords[3]-this.margin[3] - this.padding[3];

      return output.join(" ")
    },
    x_min: function() { return this.coords[0] },
    y_min: function() { return this.coords[1] },
    x_max: function() { return this.coords[2] },
    y_max: function() { return this.coords[3] },

    u_min: function() { return this.domain[0] },
    v_min: function() { return this.domain[1] },
    u_max: function() { return this.domain[2] },
    v_max: function() { return this.domain[3] },

    ux_rate: function() { return (this.x_max-this.x_min-this.margin[0]-this.margin[2]-this.padding[0]-this.padding[2])/(this.u_max-this.u_min) },
    vy_rate: function() { return (this.y_max-this.y_min-this.margin[1]-this.margin[3]-this.padding[1]-this.padding[3])/(this.v_max-this.v_min) },
  }
}
</script>

<style scoped lang="scss">
svg {
  margin: 0;
  padding: 0;
  border: solid 1px;
  background: lightyellow;
}
</style>

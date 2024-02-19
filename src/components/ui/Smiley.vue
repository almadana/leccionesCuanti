<template>
  <g>
    <circle  :cx="cx" :cy="cy" :r="radius" :fill="fill_color" stroke="black" stroke-width="0.2" />
    <ellipse :cx="cx+radius*0.4" :cy="cy-radius*0.2" :rx="radius*0.18" :ry="radius*0.25" fill="black" stroke="none" />
    <ellipse :cx="cx-radius*0.4" :cy="cy-radius*0.2" :rx="radius*0.18" :ry="radius*0.25" fill="black" stroke="none" />
    <path :d="smile(radius, happiness, cx, cy)" fill="transparent" stroke="black" stroke-width="0.6" />
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
    happiness: {
      type: Number,
      default: 0.5,
    },
    fill_color: {
      type: String,
      default: "black"
    },
    radius: {
      type: Number,
      default: 3.5,
    }

  },
  methods: {
    smile: function(radius, happiness, cx, cy) {
      //hapiness ranges between 0 and 1
      var width = radius*1.25;
      var y0 = cy+radius*0.4;
      var z0 = y0;
      var y_max = y0+width*0.5;
      var y_min = y0-width*0.5;

      var z_max = z0-width*0.1;
      var z_min = z0+width*0.1;

      var ay = (y_max-y_min);
      var y = ay*happiness+y_min;

      var az = (z_max-z_min);
      var z = az*happiness+z_min;

      var output = `M${cx-width/2} ${z} Q ${cx} ${y} ${cx+width/2} ${z}`;
      return output
    }
  },
}
</script>

<style lang="scss">
</style>

<template>
  <Smiley :happiness="_happiness()" :cx="cx" :cy="cy" :radius="radius" :fill_color="viridis()"/>
</template>

<script>
var color_scale = require('scale-color-perceptual');
import Smiley from '@/components/ui/Smiley.vue'

export default {
  components: {Smiley},
  props: {
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
    radius: {
      type: Number,
      default: 3.5,
    }
  },
  methods: {
    viridis: function() {
      return color_scale.viridis(this._happiness())
    },
    _happiness: function() {
      if (this.happiness>1) {
        return 1
      } else if (this.happiness<0) {
        return 0
      } else {
        return this.happiness
      }
    }

  }
}
</script>

<style lang="scss">
</style>

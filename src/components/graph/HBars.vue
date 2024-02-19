<template>
  <g>
    <g v-for="(group, index_i) in widths" :key="index_i">
      <g v-for="(width, index_j) in group" :key="index_j" :transform="`translate(${ys[index_i][index_j]}, ${y_max-thick-index_i*(thick+gap)})`">
        <rect :width="width" :height="thick"  :class="'group_bar_'+index_j" />
        <text v-if="width>15"  :transform="`translate(${width/2},${thick/2})`" class="bar_value">{{_labels[index_i][index_j]}}</text>
      </g>
    </g>
  </g>
</template>

<script>
export default {
  name: 'vbar',
  props: {
    frame: String,
    dx: {
      type: Number,
      default: 0
    },
    dy: {
      type: Number,
      default: 0
    },
    thick: Number,
    gap: {
      type: Number,
      default: 0
    },
    max_total: Number,
    vals: Array,
    labels: Array,
  },
  computed: {
    coords: function() { return this.frame.split(" ").map(x=>parseInt(x)); },
    x_min: function() { return this.coords[0] },
    y_min: function() { return this.coords[1] },
    x_max: function() { return this.coords[2] },
    y_max: function() { return this.coords[3] },

    widths: function() {
      var total_width = (this.x_max-this.x_min)
      var q = total_width/this.max_total;
      var output = this.vals.map(group=>group.map(val=>val*q));
      return output
    },

    ys: function() {
      var x_min = this.x_min;
      var output = this.widths.map(function(group) {
        var positions = [x_min];
        group.map((h, i)=>positions.push(positions[i]+h));
        //Last position is 'x_max', we don't use it
        positions.pop();
        return positions
      });
      return output
    },
    _labels: function() {
      return this.labels || this.vals;
    }
  },
}
</script>

<style scoped lang="scss">

.group_bar_0 { fill: $color_0; }
.group_bar_1 { fill: $color_1; }
.group_bar_2 { fill: $color_2; }

.bar_value {
  font-size: 10px;
  fill: white;
}

text {
  text-anchor: middle;
}

</style>

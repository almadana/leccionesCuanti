<template>
  <g>
    <g v-for="(group, index_i) in heights" :key="index_i">
      <g v-for="(height, index_j) in group" :key="index_j" :transform="`translate(${x_min+index_i*(thick+gap)}, ${ys[index_i][index_j]})`">
        <rect :width="thick" :height="height" :class="colors[index_j] || 'group_bar_'+index_j" :fill="colors[index_j]"/>
        <text v-if="height>15" :transform="`translate(${thick/2},${height/2})`" dy="3" class="bar_value">{{_labels[index_i][index_j]}}</text>
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
    colors: {
      type: Array,
      default: ()=>[]
    },
  },
  computed: {
    coords: function() { return this.frame.split(" ").map(x=>parseInt(x)); },
    x_min: function() { return this.coords[0] },
    y_min: function() { return this.coords[1] },
    x_max: function() { return this.coords[2] },
    y_max: function() { return this.coords[3] },

    heights: function() {
      var total_height = (this.y_max-this.y_min)
      var q = total_height/this.max_total;
      var vals_capped = this.vals.map(group=>group.map(val=>val>this.max_total ? this.max_total : val));
      var output = vals_capped.map(group=>group.map(val=>val*q));
      return output
    },

    ys: function() {
      var y_max = this.y_max;
      var output = this.heights.map(function(group) {
        var positions = [y_max];
        group.map((h, i)=>positions.push(positions[i]-h));
        //First position is 'y_max', we don't use it
        positions.shift();
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

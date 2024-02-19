<template>
  <g>
    <g v-for="(bar, index) in bars" :key="index">
      <rect :width="bar.size[0]" :height="bar.size[1]" :transform="translate(bar.loc)" :class="'group_bar_'+index" />
      <text v-if="bar.len>15" :key="index" :x="bar.size[0]/2" :y="bar.size[1]/2" dy="0.3em" :transform="translate_text(bar.loc)" class="bar_value">{{bar.len}}</text>
    </g>
  </g>
</template>

<script>

// eslint-disable-next-line
function align_start(data, group_size, max_size) {
  data.pos = 0;
}

function align_center(data, group_size, max_size) {
  data.pos = (max_size-group_size)/2;
}

function align_end(data, group_size, max_size) {
  data.pos = (max_size-group_size);
}

var align = {
  start: align_start,
  center: align_center,
  end: align_end,
}

function rotate(size) {
  var tmp = size[0];
  size[0] = size[1];
  size[1] = tmp;
  return size
}

function do_nothing(size) {
  return size
}

function barg(data, thickness, max_size, alignment="start", orientation="horizontal", scale=1) {
  var seed = {pos: 0, len: 0};
  var total = data.reduce((accum, item)=>accum+item);
  var orient;
  if (orientation=="vertical") {
    orient = rotate
  } else {
    orient = do_nothing
  }
  align[alignment](seed, total, max_size);
  var output = [seed];
  data.map(value => output.push({
    pos: output.slice(-1)[0].pos+output.slice(-1)[0].len,
    loc: orient([output.slice(-1)[0].pos+output.slice(-1)[0].len, 0]),
    len: value*scale,
    size: orient([value*scale, thickness]),
  }));

  //Remove seed
  output.shift();

  return output
}

export default {
  name: 'stacked-bar',
  props: ["size", "thickness", "alignment", "orientation", "bar_data", "scale"],
  computed: {
    bars: function() {
      var bar_data = this.bar_data.map(x=>parseInt(x));
      var barras = barg(bar_data, this.thickness, this.size, this.alignment, this.orientation, this.scale);
      return barras;
    }
  },
  methods: {
    translate: function(loc) {
      return "translate(" + loc[0] + "," + loc[1] + ")"
    },
    translate_text: function(loc) {
      return "translate(" + loc[0] + "," + loc[1] + ")"
    }
  }
}
</script>

<style scoped lang="scss">

.group_bar_0 { fill: $color_0; }
.group_bar_1 { fill: $color_1; }
.group_bar_2 { fill: $color_2; }

.bar_value {
  font-size: 2em;
  fill: white;
}

text {
  text-anchor: middle;
}

</style>

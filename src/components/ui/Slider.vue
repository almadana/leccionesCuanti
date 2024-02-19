<template>
  <div class="slider_box">
    <span class="slider_tag">{{tag}}</span>
    <input type="range" :id="id" :code="code" :class="'slider has-output is-group'+code" :disabled="disabled" :min="min" :max="max" :step="step" :value="value" @input="$emit('input', $event.target.value)">
  </div>
</template>

<script>

export default {
  name: 'slider',
  props: ['id', 'code', 'disabled', 'tag', 'min', 'max', 'step', 'value', 'output_for'],
}
</script>

<style scoped lang="scss">

.sliders {
  display: flex;
}

.slider_box {
  display: flex;

  .slider_tag {
    padding: 0.2em;
    margin: 0.2em;
  }

  input {
    flex: 1 1 auto;
  }

  output {
    margin: 0.2em;
    padding: 0.2em;
    min-width: 2em;
    text-align: center;
  }
}


input[type=range][code="0"]::-moz-range-track    {background:$grey; height: 1em;}
input[type=range][code="0"]::-moz-range-progress {background:$color_bg_0; height: 1em;}

input[type=range][code="1"]::-moz-range-track    {background:$grey; height: 1em;}
input[type=range][code="1"]::-moz-range-progress {background:$color_bg_1; height: 1em;}

input[type=range][code="2"]::-moz-range-track    {background:$grey; height: 1em;}
input[type=range][code="2"]::-moz-range-progress {background:$color_bg_2; height: 1em;}

input[type=range][code="3"]::-moz-range-track    {background:$grey; height: 1em;}
input[type=range][code="3"]::-moz-range-progress {background:$color_bg_3; height: 1em;}
</style>

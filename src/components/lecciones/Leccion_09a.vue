<template>
  <article class="lesson">
    <LessonHeader title="Correlación" />
    <h2></h2>
    <section class="introduction">
      <p>
      </p>
    </section>
    <section class="lesson_body">
      <section class="actions">
      </section>
      <section class="data_control" >
        <h2>R de Pearson = {{pearson.toFixed(2)}} | R<sup>2</sup> = {{(pearson**2).toFixed(2)}}</h2>
        <div class="alpha_slider_tags">
          <span class="alpha_slider_tag_left">-1</span>
          <span class="alpha_slider_tag_right">1</span>
        </div>
        <input type="range" :min="-1" :max="1" :step="0.01" :value="alpha" @input="update_alpha($event.target.value)" class="alpha_slider">
      </section>

      <section class="plot">
        <Graph v-slot:default="context" width="800px" :coords="[0, 0, 400, 200]" :margin="[30, 20, 10, 30]" :grid="[10, 1]" :domain="[5, 4, 35, 9]" preserveAspectRatio="none">
          <GTitle :frame="context.frame" :margin="5" text="Correlación" />
          <Xaxis  :frame="context.frame" :gap="context.x_gap/5" :labels="range(5,36,2)"/>
          <XTitle :frame="context.canvas" :margin="17" text="Satisfacción con la vida" />
          <Vlines :frame="context.frame" :scale="context.scale" :delta="2"/>
          <Yaxis  :frame="context.frame" :gap="context.y_gap" :labels="range(4,10,1)"/>
          <YTitle :frame="context.canvas" :margin="18" text="Horas de sueño" />
          <Hlines :frame="context.frame" :scale="context.scale" :delta="1"/>
          <line :x1="scale_x(7)" :y1="scale_y(7*linear_fit[1]+linear_fit[0])" :x2="scale_x(37)" :y2="scale_y(37*linear_fit[1]+linear_fit[0])" stroke="black" />
          <g v-for="(item, index) in population" :key="index" >
            <SmileyViridis :cx="scale_x(item[0])" :cy="scale_y(item[1])" :radius="8" :happiness="((item[0]-5)/30.0)" />
            <Clocky :cx="scale_x(item[0])" :cy="scale_y(item[1])" :radius="8*1.2" :hours="item[1]" :min="4" :max="9"/>
          </g>
        </Graph>

      </section>
    </section>
  </article>
</template>

<script>
//import {chisquare} from 'jstat'
var zip = require('lodash/zip');
var color_scale = require('scale-color-perceptual');
var range = require('lodash/range');

import {corrcoeff, lstsq} from 'jstat'
import SmileyViridis from '@/components/ui/SmileyViridis.vue'
import Clocky from '@/components/ui/Clocky.vue'

import {populator} from '@/library/population_generator';
import {linear_scale} from '@/library/linear_scale';


//function correlator(size) {
//  return function(samples) {
//    return samples.map(sample => sample+size*normal.sample(0,1));
//  }
//}

//function correlate(samples, alpha) {
//  var correlate = correlator(alpha);
//  return correlate(samples);
//}

function sleep(population, noise_base, alpha) {
  var mean = 7.23;
  var stdev = 1.17;
  var samples = population.map(member=>member.z);
  var output = samples.map(function(sample, index) {
    return (sample*alpha + noise_base[index]*(1-Math.abs(alpha)))*stdev+ mean;
  }); 
  return output
}

var population_size = 50;

var min_x = 22;
var max_x = 380;
var min_y = 150;
var max_y = 50.0;
var min_domain_x = 7.0;
var max_domain_x = 37.0;
var min_domain_y = 4;
var max_domain_y = 9.0;

var population1_setup = {
  mean: 21.7,
  stdev: 5.78
}

var noise_setup = {
  mean: 0,
  stdev: 1
}

var population1 = populator(population_size, population1_setup.mean, population1_setup.stdev, min_domain_x, max_domain_x);
var happiness = population1.map(item=>item.happiness);
var population2 = populator(population_size, noise_setup.mean, noise_setup.stdev, -10, 10);
var noise = population2.map(item=>item.x);
var alpha = 1;
var population = zip(happiness, sleep(population1, noise, alpha));

function linear_fit(alpha) {
  var ys = sleep(population1, noise, alpha);
  var a = happiness.map(x=>[1,x]);
  var output = lstsq(a, ys);
  return output
}

export default {
  name: 'Leccion_09a',
  title: 'Introducción',
  components: {SmileyViridis, Clocky},
  data: function() {
    return {
      population1_setup,
      alpha: alpha,
      population: population,
      pearson: 1,
      linear_fit: linear_fit(alpha),
      color_scale
    }
  },
  methods: {
    range: range,
    scale_x: linear_scale(min_domain_x, max_domain_x, min_x, max_x),
    scale_y: linear_scale(min_domain_y, max_domain_y, min_y, max_y),
    update_alpha: function(value) {
      this.alpha = parseFloat(value);
      var ys = sleep(population1, noise, this.alpha);
      this.population = zip(happiness, ys);
      this.pearson = corrcoeff(happiness,ys);

      this.linear_fit = linear_fit(this.alpha)
    },
  }
}
</script>

<style scoped lang="scss">
.alpha_slider {
  width: 800px;
}
.alpha_slider_tags {
  display: flex;
  justify-content: space-between;
  width: 800px;
  font-weight: bold;
}

</style>

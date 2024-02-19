<template>
  <article class="lesson lesson_03a">
    <LessonHeader title="Media y desvío" />
    <section class="lesson_body">
      <section class="introduction">
        <p>Desde el año 2015, en el curso "Métodos y Técnicas Cuantitativas", recabamos algunos datos acerca de la población de estudiantes. Entre otros aspectos, se indaga sobre el constructo psicológico "Grado de satisfacción general con la vida" empleando la "Escala de satisfacción con la vida" (ESGV). Esta escala opera de la siguiente manera: respondiendo a una serie de 5 reactivos de tipo "Likert" (afirmaciones con las que se indica estar "muy en desacuerdo", a "muy de acuerdo"), se construye una escala que resulta en un rango de puntuaciones entre 5 y 35, que reflejan el menor y el mayor nivel de satisfacción general con la vida que el instrumento permite representar.</p><p> Tomando en cuenta más de 1400 respuestas de parte de estudiantes, las puntuaciones tienen:
        <ul>
            <li>Una <strong>media</strong> de 22.32</li>
            <li>Un <strong>desvío estándar</strong> de 5.78</li>
        </ul>
        </p>
        <p> En el panel inferior, encontrarás una simulación desarrollada en base a estos valores. Al dar click en "comenzar", comenzará un proceso de simulación que "genera" posibles "estudiantes", que representan cada uno posibles valores de la escala ESGV. Estos "individuos" generados aparecerán representados gráficamente en el panel inferior. 
        </p>
        <p><strong>Pero,</strong> quizás notes que no todos los valores posibles de la escala aparecen con igual frecuencia. En la gráfica se representa un histograma de los valores obtenidos hasta el momento. Puedes elegir una velocidad mayor para notar el patrón emergente en el histograma.</p>
        <p>A medida que el número de casos simulados aumenta, emerge un patrón: el histograma de valores parece concentrarse en torno a un valor, y la dispersión está relativamente acotada. Lo que sucede es que la simulación está diseñada para reproducir dos aspectos de la distribución real de valores: la media y el desvío de la distribución real de las puntuaciones de estudiantes de Cuanti.</p>
        <p>De esta forma, mediante esta simulación y representación gráfica puedes tener una idea aproximada acerca de cómo "luce" una distribución de valores de la escala, apreciando que si bien la media es 22 (relativamente satisfecho con la vida), pueden observarse casos individuales de menor y mayor nivel, con cierta frecuencia.</p>
        <p>Cuando hayas terminado de jugar/explorar con esta simulación, ve a la versión "editable" de esta lección (haz click en Siguiente o en la barra de navegación).</p>
      </section>
      <section class="demo">
        <section class="controls">
          <button @click="start_animation()" :disabled="this.animate" >Comenzar</button>
          <button @click="stop_animation()" :disabled="!this.animate">Detener</button>
          <button @click="restart_animation()" :disabled="this.animate" >Resetear</button>
          <select v-model="animation_delay">
            <option value="90">muy lento</option>
            <option value="60">lento</option>
            <option value="30">rápido</option>
            <option value="20">muy rápido</option>
            <option value="7">máxima velocidad</option>
          </select>
        </section>
        <section class="graphics">
          <div class="dashboard">
            <Graph v-slot:default="context" :coords="[0, 0, 350, 200]" :margin="[10, 20, 10, 10]" :padding="[0,0,0,0]" :grid="[10, 10]" :domain="[5, 0, 35, 200]" width="50%" preserveAspectRatio="xMinYMax meet" class="plot">
              <Vlines :frame="context.canvas" :scale="context.scale" :delta="2"/>
              <Hlines :frame="context.canvas" :scale="context.scale" :delta="20"/>
              <Xaxis  :frame="context.canvas" :gap="context.x_gap*0.2" :labels="range(5,36,2)"/>
              <g>
              <GTitle :frame="context.frame" :margin="4" text="Histograma" />
              <VBars  :frame="context.canvas"
                      :max_total="200" 
                      :thick="context.x_gap/circle.nbins*3" 
                      :gap="0" 
                      :vals="histo.bins.map((value, index)=>(new Array(index).fill(0).concat([value])))"
                      :colors="range(0,1,1/circle.nbins).map(color_scale.viridis)"
              />
              </g>
            </Graph>
            <svg viewBox="0 0 100 10" width="50%" class="values_samples">
              <rect width="100" height="10" transform="translate(0,0)" class="frame"/>
              <g>
                <circle :cx="(circle.mean-circle.min-circle.sigma)/(circle.max-circle.min)*92" cy="6" r="3.5" :fill="color_scale.viridis((circle.mean-circle.min-circle.sigma)/(circle.max-circle.min))" stroke="black" stroke-width="0.2" />
                <ellipse :cx="(circle.mean-circle.min-circle.sigma)/(circle.max-circle.min)*92-1.5" cy="5.3" rx="0.6" ry="0.8" fill="black" stroke="none" />
                <ellipse :cx="(circle.mean-circle.min-circle.sigma)/(circle.max-circle.min)*92+1.5" cy="5.3" rx="0.6" ry="0.8" fill="black" stroke="none" />
                <path :d="circle.smile(circle.mean-circle.sigma, (circle.mean-circle.min-circle.sigma)/(circle.max-circle.min)*92, 5.8)" fill="transparent" stroke="black" stroke-width="0.2" />
                <text class="smile_text" :x="(circle.mean-circle.min-circle.sigma)/(circle.max-circle.min)*92-5" y="2.1">
                media-desvío
                </text>
              </g>
              <g>
              <circle :data-mean="circle.mean" :cx="(circle.mean-circle.min+circle.sigma)/(circle.max-circle.min)*92" cy="6" r="3.5" :fill="color_scale.viridis((circle.mean-circle.min+circle.sigma)/(circle.max-circle.min))" stroke="black" stroke-width="0.2" />
              <ellipse :cx="(circle.mean-circle.min+circle.sigma)/(circle.max-circle.min)*92-1.5" cy="5.3" rx="0.6" ry="0.8" fill="black" stroke="none" />
              <ellipse :cx="(circle.mean-circle.min+circle.sigma)/(circle.max-circle.min)*92+1.5" cy="5.3" rx="0.6" ry="0.8" fill="black" stroke="none" />
              <path :d="circle.smile(circle.mean+circle.sigma, (circle.mean-circle.min+circle.sigma)/(circle.max-circle.min)*92, 5.8)" fill="transparent" stroke="black" stroke-width="0.2" />
              <text class="smile_text" :x="(circle.mean-circle.min)/(circle.max-circle.min)*92-2.5" y="2.1">
              media
              </text>
              </g>
              <g>
              <circle :data-mean="circle.mean" :cx="(circle.mean-circle.min)/(circle.max-circle.min)*92" cy="6" r="3.5" :fill="color_scale.viridis((circle.mean-circle.min)/(circle.max-circle.min))" stroke="black" stroke-width="0.2" />
              <ellipse :cx="(circle.mean-circle.min)/(circle.max-circle.min)*92-1.5" cy="5.3" rx="0.6" ry="0.8" fill="black" stroke="none" />
              <ellipse :cx="(circle.mean-circle.min)/(circle.max-circle.min)*92+1.5" cy="5.3" rx="0.6" ry="0.8" fill="black" stroke="none" />
              Circle.smile = function(value, cx, cy) {
              <path :d="circle.smile(circle.mean, (circle.mean-circle.min)/(circle.max-circle.min)*92, 5.8)" fill="transparent" stroke="black" stroke-width="0.2" />
              <text class="smile_text" :x="(circle.mean-circle.min+circle.sigma)/(circle.max-circle.min)*92-5" y="2.1">
              media+desvío
              </text>
              </g>
            </svg>
            <div class="x_scale">
              <svg viewBox="0 0 100 10" width="50%" class="values_scale">
                <g>
                  <rect width="100" height="10" transform="translate(0,0)" />
                </g>
                <g>
                </g>
              </svg>
            </div>
          </div>
          <div class="circles_stream">
            <svg viewBox="0 0 100 10" width="100%">
              <g>
              <circle v-for="circle in circles" :key="`circle_${circle.id}`" :cx="circle.cx" :cy="circle.cy" :r="circle.r" :fill="circle.fill" stroke="black" stroke-width="0.2" />
              <ellipse v-for="circle in circles" :key="`eye_left_${circle.id}`" :cx="circle.cx-1.5" :cy="circle.cy-1.4" rx="0.6" ry="0.8" fill="black" stroke="none" />
              <ellipse v-for="circle in circles" :key="`eye_right_${circle.id}`" :cx="circle.cx+1.5" :cy="circle.cy-1.4" rx="0.6" ry="0.8" fill="black" stroke="none" />
              <path v-for="circle in circles" :key="`smile_${circle.id}`" :d="circle.smile()" fill="transparent" stroke="black" stroke-width="0.2" />
              <rect width="100" height="10" transform="translate(0,0)" class="frame"/>
              </g>
            </svg>
          </div>
        </section>
      </section>
      <section class="questions">
      </section>
      <section class="next_lesson">
        <a class="link" @click="$emit('load_lesson', Leccion_3b)">Siguiente >></a>
      </section>
    </section>
  </article>
</template>

<script>
var range = require('lodash/range');
var color_scale = require('scale-color-perceptual');

import Leccion_3b from '@/components/lecciones/Leccion_03b.vue'

//https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform#Basic_form
//https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/36481059#36481059

function boxmuller() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function Circle() {
  this.shift = function() {
    if (this.cx>110) {
      return
    }
    this.cx += this.step;
  }

  this.val = function() {
    var scaled = Circle.sigma*this.z_flip+Circle.mean;
    return scaled
  }

  this.value = function() {
    var col = this.val();
    if (col<this.min) {
      col = this.min; 
    } else if (col>this.max) {
      col = this.max
    }
    col = Math.floor(col);
    return col
  }

  this.color = function() {
    var col = this.value();
    var color = color_scale.viridis(col/35.0);
    return color
  }

  this.smile = function() {
    return Circle.smile(this.value(), this.cx, this.cy)
  }

  this.cx = -5;
  this.cy = 5;
  this.max = 35.0;
  this.min = 5.0;
  this.r = 4;
  this.z_flip = boxmuller();
  this.fill = this.color();
  this.step = 1;
  this.id = Circle.last_id++;
}

function Histo(nbins, min, max) {
  this.reset = function() {
    this.bins = range(nbins).map(()=>0);
  }

  this.push = function(value) {
    var delta = this.delta;
    var slot = this.slots.findIndex(function(item) {
      return value<item+delta
    });
    if (slot>=0) {
      this.bins[slot]++
    }
  }

  this.nbins = nbins;
  this.min = min;
  this.max = max;
  this.delta = 1.0*(max-min)/nbins;
  this.slots = range(nbins).map(i=>i*this.delta+this.min);
  this.reset()
}

Circle.last_id = 0;
Circle.mean = 22;
Circle.sigma = 6;
Circle.min = 5;
Circle.max = 35;
Circle.nbins = 15;

Circle.smile = function(value, cx, cy) {
    var width = 4;
    var y0 = cy+1.5;
    var dy_max = 2;
    var dy_min = -2.4;

    var a = (dy_max-dy_min)/(Circle.max-Circle.min);
    var b = dy_min - a*this.min;
    var dy = a*value + b;

    var output = `M${cx-width/2} ${y0} Q ${cx} ${y0+dy} ${cx+width/2} ${y0}`;
    return output
  }

var histo = new Histo(Circle.nbins, Circle.min, Circle.max+1);
var counters = range(30).map(()=>0);
var z_samples = [];

var circles = [ new Circle() ];

export default {
  name: 'Leccion_03a',
  title: 'Introducción',
  data: function() {
    return {
      circle: Circle,
      values: counters,
      histo: histo,
      color_scale: color_scale,
      animate: false,
      animation_delay: 60,
      circles,
      Leccion_3b
    }
  },
  computed: {
  },
  methods: {
    range: range,
    mean1: function() {
      var output = Circle.mean;
      window.console.log("mean1", output);
      return output
    },
    update_mean: function(new_value) {
      window.console.log("1...", new_value);
      Circle.mean = parseFloat(new_value);
      window.console.log("circle mean...", Circle.mean);
      histo.reset();
      this.circles.map(circle=>histo.push(circle.value()));
      this.circles.map(circle=>circle.fill=circle.color());
      window.console.log("2...", new_value);
    },
    update_sigma: function(new_value) {
      Circle.sigma = parseFloat(new_value);
      histo.reset();
      this.circles.map(circle=>histo.push(circle.value()));
      this.circles.map(circle=>circle.fill=circle.color());
    },
    start_animation: function() {
      this.animate = true;
      this.shift_circles();
    },
    stop_animation: function() {
      this.animate = false;
    },
    restart_animation: function() {
      while (circles.length>0) {
        circles.pop()
      }
      circles.push(new Circle());
      histo.reset();
    },
    shift_circles: function() {
      if (!this.animate) {
        return
      }
      if (this.circles[0].cx>this.circles[0].r) {
        var circle = new Circle();
        z_samples.push(circle.z_score);
        histo.push(circle.value());
        counters[circle.value()]++;

        this.circles.unshift(new Circle());
      }
      this.circles.map(circle=>circle.shift());
      setTimeout(this.shift_circles, this.animation_delay)
    },
  },
  mounted: function() {
  }
}
</script>

<style lang="scss">
.lesson_03a {
  .frame {
    fill: none;
    stroke: black;
    stroke-width: 0.3px;
  }

  .slider {
    width: 50%;
  }

  .dashboard {
    text.bar_value {
      display: none;
    }

    .values_scale {
      background: #4a7d70;
      background-image: linear-gradient(90deg, #440154, #482475, #414487, #355f8d, #2a788e, #21908d, #22a884, #42be71, #7ad151, #bddf26, #bddf26);
      rect {
        stroke: black;
        stroke-width: 0.2px;
        fill: none;
      }
    }
    .plot {
      rect {
        stroke: black;
        stroke-width: 0.2px;
      }
    }
  }
}

.mean_control {
  padding-left: 10px;
  padding-right: 30px;
}

.text_mean {
  font-size: 8px;
}

.smile_text {
  fill: black;
  font-size: 1.8px;
}


</style>

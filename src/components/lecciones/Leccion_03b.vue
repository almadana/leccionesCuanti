<template>
  <article class="lesson lesson_03a">
    <LessonHeader title="Media y desvío" />
    <section class="lesson_body">
      <section class="introduction">
        <p>Ahora puedes explorar qué pasaría si cambias la media y el desvío de la población. Recuerda que para ver los resultados acumulados en el histograma, debes esperar un rato. Para reducir la espera puedes aumentar la velocidad de aparición.</p>
        <p><strong>Recomendamos:</strong>
        </p>
        <ul>
          <li>Llevar el desvío a 0.</li>
          <li>Probar distintos valores de media.</li>
          <li>Llevar el desvío al máximo.</li>
          <li>Probar distintos valores de media.</li>
          <li>Explorar libremente ambos controles.</li>
        </ul>
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
                <SmileyViridis :cy="6" :happiness="(circle.mean-circle.min-circle.sigma)/(circle.max-circle.min)" :cx="(circle.mean-circle.min-circle.sigma)/(circle.max-circle.min)*100" />
                <text class="smile_text" :x="(circle.mean-circle.min-circle.sigma)/(circle.max-circle.min)*100-5" y="2.1">
                media-desvío
                </text>
              </g>
              <g>
              <SmileyViridis :cy="6" :happiness="(circle.mean-circle.min+circle.sigma)/(circle.max-circle.min)" :cx="(circle.mean-circle.min+circle.sigma)/(circle.max-circle.min)*100" />
              <text class="smile_text" :x="(circle.mean-circle.min)/(circle.max-circle.min)*100-2.5" y="2.1">
              media
              </text>
              </g>
              <g>
              <SmileyViridis :cy="6" :happiness="(circle.mean-circle.min)/(circle.max-circle.min)" :cx="(circle.mean-circle.min)/(circle.max-circle.min)*100" />
              <text class="smile_text" :x="(circle.mean-circle.min+circle.sigma)/(circle.max-circle.min)*100-5" y="2.1">
              media+desvío
              </text>
              </g>
            </svg>

            <h2>Media</h2>
            <div class="mean_control">
              <span :class="{slider_disabled: !this.animate}">
                <input type="range" class="slider has-output is-group0" :min="5" :max="35" :step="1" :value="circle.mean" :disabled="!this.animate" @input="update_mean($event.target.value)">
              </span>
            </div>
            <h2>Desvío</h2>
            <div :class="{sigma_control: true, disabled: !this.animate}">
              <span :class="{slider_disabled: !this.animate}">
                <input type="range" class="slider has-output is-group0" :min="0" :max="12" step="1" :value="circle.sigma" :disabled="!this.animate" @input="update_sigma($event.target.value)">
              </span>
            </div>
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
                <SmileyViridis v-for="circle in circles" :key="`smile_${circle.id}`" :cx="circle.cx" :cy="circle.cy" :happiness="circle.happiness()" />
                <rect width="100" height="10" transform="translate(0,0)" class="frame"/>
              </g>
            </svg>
          </div>
        </section>
      </section>
      <section class="questions">
      </section>
    </section>
  </article>
</template>

<script>
var range = require('lodash/range');
var color_scale = require('scale-color-perceptual');

import SmileyViridis from '@/components/ui/SmileyViridis.vue'

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
    if (col<Circle.min) {
      col = Circle.min; 
    } else if (col>Circle.max) {
      col = Circle.max
    }
    col = Math.floor(col);
    return col
  }

  this.color = function() {
    var col = this.value();
    var color = color_scale.viridis(col/Circle.max);
    return color
  }

  this.smile = function() {
    return Circle.smile(this.value(), this.cx, this.cy)
  }

  this.happiness = function() {
    return this.value()/(Circle.max-Circle.min);
  }

  this.cx = -5;
  this.cy = 5;
  this.max = Circle.max;
  this.min = Circle.min;
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
Circle.mean_initial = 22;
Circle.sigma = 6;
Circle.sigma_initial = 6;
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

Circle.reset = function() {
  Circle.mean = Circle.mean_initial;
  Circle.sigma = Circle.sigma_initial;
}

var histo = new Histo(Circle.nbins, Circle.min, Circle.max+1);
var counters = range(30).map(()=>0);
var z_samples = [];

var circles = [ new Circle() ];

export default {
  name: 'Leccion_03b',
  title: 'Editable',
  components: {SmileyViridis},
  data: function() {
    return {
      circle: Circle,
      values: counters,
      histo: histo,
      color_scale: color_scale,
      animate: false,
      animation_delay: 60,
      circles,
    }
  },
  computed: {
  },
  methods: {
    range: range,
    mean1: function() {
      var output = Circle.mean;
      return output
    },
    update_mean: function(new_value) {
      Circle.mean = parseFloat(new_value);
      histo.reset();
      this.circles.map(circle=>histo.push(circle.value()));
      this.circles.map(circle=>circle.fill=circle.color());
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
      Circle.reset();
      histo.reset();
      while (circles.length>0) {
        circles.pop()
      }
      circles.push(new Circle());
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

.slider_disabled {
  background: lightgrey;
}

.sigma_control {
  margin-bottom: 1rem;
}

</style>

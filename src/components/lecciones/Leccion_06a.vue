<template>
  <article class="lesson">
    <LessonHeader title="Muestreo" />
    <section class="lesson_body">
      <section class="sampling">
          <span>
            Tamaño de la muestra: 
            <select name="samples_size" :value="samples_size" :disabled="auto_sampling" @input="update_samples_size($event.target.value)">
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
              <option>50</option>
              <option>100</option>
            </select>
          </span>
          <span class="separator">|</span>
          <button type="button" @click="sample" :disabled="auto_sampling">Muestrear</button>
          <span class="separator">|</span>
          <button v-if="!auto_sampling" type="button" @click="start_auto_sample">Automático</button>
          <button v-if="auto_sampling" type="button" @click="stop_auto_sample">Detener</button>
      </section>

      <p>
        Media de la población: 22.32 | Desvío de la población: 5.78
      </p>
      <section class="sample_info">
        Media de la muestra: {{avg.toFixed(2)}} | Tamaño de la muestra: {{samples_size}}
      </section>
      <section class="current_sample">
        <Graph v-slot:default="context" width="1000px" :coords="[0, 0, 400, 150]" :margin="[20, 30, 10, 20]" :grid="[10, 1]" :domain="[0, 0, nbins*10, 10]" preserveAspectRatio="none">
        <Vlines :frame="context.frame" :scale="context.scale" :delta="10"/>
        <Hlines :frame="context.frame" :scale="context.scale" :delta="1" :stroke_width="0.1"/>
        <Xaxis  :frame="context.frame" :gap="context.x_gap" :labels="range(5,36,(35-5.0)/nbins)"/>
        <Yaxis  :frame="context.frame" :gap="context.y_gap" :labels="range(0,11,1)"/>
        <GTitle :frame="context.frame" :margin="18" :text="'Muestra: ' + SamplePoint.count" />
        <GTitle class="frame_subtitle" :frame="context.frame" :margin="6" :text="`(media ${avg.toFixed(2)}, desvío ${stdev.toFixed(2)})`" />
        <g transform="translate(0,20)" >
          <YTitle :frame="context.canvas" :margin="15" text="frecuencia" />
        </g>
        <VBars  :frame="context.frame" 
                :max_total="10" 
                :thick="context.x_gap"
                :gap="0"
                :vals="current_values().map((value, index)=>(new Array(index).fill(0).concat([value])))"
                :colors="range(0,1,1.0/nbins).map(color_scale.viridis)"
                :labels="current_values().map(val=>[val])"
                />

          <g :transform="'translate('+ ((avg-5)*(370/(35-5))+20) +','+5+')'">
            <path :d="'M '+0+' 25 L '+0+' 150'" fill="none" stroke="blue" stroke-width="1"></path>
          </g>
        </Graph>
      </section>
      <section>
        <Graph v-slot:default="context" width="1000px" :coords="[0, 0, 400, 170]" :margin="[20, 30, 10, 20]" :grid="[10, 1]" :domain="[0, 0, nbins*10, 10]" preserveAspectRatio="none">
          <g transform="translate(0,0)">
            <Xaxis  :frame="context.frame" :gap="context.x_gap" :labels="range(5,36,(35-5.0)/nbins)"/>
          </g>
          <g transform="translate(0,10)">
            <text style="font-size: 0.5em">Incluye {{SamplePoint.included}} </text>
            <text dy="2em" style="font-size: 0.5em">No incluye {{SamplePoint.notincluded}} </text>
            <text dy="4em" style="font-size: 0.5em">Porcentaje {{(SamplePoint.level).toFixed(2)}} </text>
          </g>
          <g :transform="'translate('+ ((22.32-5)*(370/(35-5))+20) +','+0+')'">
            <path d="M 0 0 L 0 150" fill="none" stroke="green" stroke-width="1"/>
          </g>
          <g :transform="'translate('+ ((avg-5)*(370/(35-5))+20) +','+0+')'">
            <path d="M 0 0 L 0 5" fill="none" stroke="blue" stroke-width="1"></path>
          </g>
          <g v-for="sample in sample_points" :key="sample.id">
            <path :d="`M ${sample.x_left} ${sample.y} L ${sample.x_right} ${sample.y}`" stroke-width="0.5" :stroke="sample.good ? 'grey' : 'red'"></path>
            <circle :cx="sample.x_center" :cy="sample.y" r="2" :fill="sample==sample_points.slice(-1)[0] ? 'blue' : 'grey'" stroke="black" stroke-width="0.2" />
          </g>
        </Graph>
        <p>
        Nivel de confianza <input type="text" style="width:2em" :value="SamplePoint.slider" @input="update_confidence($event.target.value)"> <input type="range" :min="5" :max="99" :step="5" :value="SamplePoint.slider" @input="update_confidence($event.target.value)">
        </p>
      </section>
    </section>
  </article>
</template>

<script>
var range = require('lodash/range');
var color_scale = require('scale-color-perceptual');
import {std, mean} from 'mathjs'
import {studentt, stdev} from 'jstat'
import {linear_scale} from '@/library/linear_scale';
import {Population} from '@/library/population_generator';

var population0 = new Population(500, 22, 5.6, 5.0, 35.0);

var autosampling_min_delay = 100;
var autosampling_jump = 0;

function HistoNumbers(min, max, nbins) {
  this.reset = function() {
    this.edges = [];
    this.values = [];
    this.freqs = {};

    var delta = (max-min)/nbins;

    for (var i=0; i<nbins; i++) {
      this.edges.push(min+i*delta);
    }

    for (var edge of this.edges) {
      this.freqs[edge] = 0;
    }
  }

  this.add = function(new_data) {
    this.values = this.values.concat(new_data);

    this.avg = mean(this.values);
    this.stdev = stdev(this.values);

    for (var value of new_data) {
      for (var i=this.edges.length-1; i>=0; i--) {
        if (value>=this.edges[i]) {
          this.freqs[this.edges[i]]++;
          break
        }
      }
    }
  };

  this.push = function(new_data) {
    this.reset();
    this.add(new_data);
  }

  this.get_bin = function(value) {
    var i;
    for (i=this.edges.length-1; i>=0; i--) {
      if (value>=this.edges[i]) {
        return i
      }
    }
  }

  this.min = min;
  this.max = max;
  this.nbins = nbins;
  this.avg = 0;
  this.stdev = 0,

  this.reset();
}

var nbins = 15;
var histo = new HistoNumbers(5, 35, nbins)
var current_histo = new HistoNumbers(5, 35, nbins)

var sample_points = [];

function SamplePoint(avg, stdev) {
  this.jump = function() {
    var index;
    this.y = this.y + SamplePoint.step;
    if (this.y>SamplePoint.maxy) {
      index = sample_points.indexOf(this);
      sample_points.splice(index,1);
    }
    if (this.y<SamplePoint.miny) {
      index = sample_points.indexOf(this);
      sample_points.splice(index,1);
    }
  }

  this.set_width = function() {
    var weight = Math.abs(studentt.inv((1-SamplePoint.slider/100.0)/2, SamplePoint.size-1));
    this.x_left = scale(avg-weight*std_error)+SamplePoint.margin_x;
    this.x_right = scale(avg+weight*std_error)+SamplePoint.margin_x;
    this.good = this.check_interval();
  }

  this.check_interval = function() {
    return this.x_left<scale(SamplePoint.avg_population)+SamplePoint.margin_x && this.x_right>scale(SamplePoint.avg_population)+SamplePoint.margin_x
//    return Math.abs(avg-SamplePoint.avg_population)<stdev
  }

  var scale = linear_scale(5, 35, 0, 370)

  this.id = SamplePoint.id;
  SamplePoint.id++;

  this.avg = avg;
  this.stdev = stdev;
  this.y = SamplePoint.y0;
  this.x = scale(avg);
  this.x_center = scale(avg)+SamplePoint.margin_x;

  var std_error = stdev/Math.sqrt(SamplePoint.size);
  this.std_error = std_error;
  this.set_width();

  if (this.good) {
    SamplePoint.included++
  } else {
    SamplePoint.notincluded++
  }

  SamplePoint.count = SamplePoint.count + 1;
  SamplePoint.level = SamplePoint.included/SamplePoint.count*100;

  sample_points.map((sp)=>sp.jump());
  sample_points.push(this);
}

SamplePoint.step = 5;
SamplePoint.id = 1;
SamplePoint.y0 = 5;
SamplePoint.maxy = 145;
SamplePoint.miny = 0;
SamplePoint.x0 = 50;
SamplePoint.margin_x = 20;
SamplePoint.max_avg = 35;
SamplePoint.min_avg = 5;
SamplePoint.size = 5;
SamplePoint.slider = 95;
SamplePoint.avg_population = 22.32;
SamplePoint.included = 0;
SamplePoint.notincluded = 0;
SamplePoint.count = 0.0;
SamplePoint.level = 0;

export default {
  name: 'Leccion_06a',
  title: 'Introducción',
  data: function() {
    return {
      sample_count: 0,
      samples_size: SamplePoint.size,
      sample_points,
      SamplePoint,
      auto_sampling: false,
      auto_sampling_delay: 400,
      population0,
      current_sample: [],
      avg_bin: 0,
      avg: 0,
      stdev: 0,
      histo: histo,
      color_scale: color_scale,
      nbins
    }
  },
  computed: {

  },
  methods: {
    range: range,
    update_samples_size: function(value) {
      SamplePoint.included = 0;
      SamplePoint.notincluded = 0;
      SamplePoint.count = 0.0;
      SamplePoint.level = 0;
      var new_size = parseInt(value);
      SamplePoint.size = new_size;
      this.samples_size = new_size;
      sample_points.map(sample=>sample.set_width());
//      histo.reset();
//      current_histo.reset();
    },
    update_confidence: function(value) {
      SamplePoint.included = 0;
      SamplePoint.notincluded = 0;
      SamplePoint.count = 0.0;
      SamplePoint.level = 0;
      SamplePoint.slider = value;
    },
    population_values: function() {
      var scale = 1;
      var raw_values = histo.edges.map(edge=>histo.freqs[edge]);
      var max = Math.max(...raw_values);
      if (max>=200) {
        this.auto_sampling = false;
      }
      var values = raw_values.map(value=>value*scale)
      return values
    },
    current_values: function() {
      var scale = 1;
      var raw_values = current_histo.edges.map(edge=>current_histo.freqs[edge]);
      var max = Math.max(...raw_values);
      if (max>100) {
        scale = 100/max;
      }
      var values = raw_values.map(value=>value*scale)
      return values
    },
    auto_sample: function(delay) {
      if(this.auto_sampling) {
        if (delay<autosampling_min_delay) {
          delay = autosampling_min_delay;
        }
        this.sample();
        setTimeout(this.auto_sample, delay, (delay-autosampling_jump));
      }
    },
    start_auto_sample: function() {
      if (this.auto_sampling) {
        return
      }

      this.auto_sampling = true;
      this.auto_sample(this.auto_sampling_delay);
    },
    stop_auto_sample: function() {
      this.auto_sampling = false
    },
    sample: function() {
      population0.members.map(item => item.selected=false); 
      var unselected = population0.members.slice(0);
      var selection = [];
      for (var i=0; i<this.samples_size; i++)  {
      var item = unselected.splice(Math.floor(Math.random() * unselected.length), 1)[0];
        item.selected = true;
        selection.push(item);
      }
      this.current_sample = selection.map(item=>item.x);

      var sum = this.current_sample.reduce((prev, curr)=>prev+curr);
      this.avg = sum/this.current_sample.length;
      this.stdev = std(this.current_sample);
      this.avg_bin = histo.get_bin(this.avg);
      histo.add([this.avg]);
      current_histo.push(this.current_sample);
      new SamplePoint(this.avg, this.stdev);
    }
  },
  mounted: function() {
  }

}
</script>

<style lang="scss">
.separator {
  margin: 1em;
}

.person {
  color: green;
}

.population svg {
  background: yellow;
}

#population {
  display: flex;
  flex-wrap: wrap;
}


.item_selected_true {
  fill: red;
}

.valor_media {
  font-size: 8px;
}

.sample_info {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.frame_subtitle text {
  font-size: 12px !important;
}

svg.sample_history {
  background: lightyellow;
}

.smileys {
  display: flex;
  flex-wrap: wrap;
}

</style>

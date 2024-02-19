<template>
  <article class="lesson">
    <LessonHeader title="Prueba t de Student" />
    <section class="lesson_body">
      <p>En la encuesta realizada a los estudiantes de Cuanti, las medias de la Escala de Satisfacción General con la Vida (ESGV) son diferentes para Hombres y Mujeres. En esta lección podremos explorar si estas diferencias se pueden generalizar a la población de estudiantes hombres y mujeres (y no son sólo particulares de esta muestra) mediante la prueba t de Student.</p>
<p>En el panel superior verás una "muestra" representativa de los hombres, y en el inferior una representativa de las mujeres. En el centro se muestra el valor del estadístico t y el p-valor resultante. En las versiones interactivas de esta lección, podrás variar la diferencia entre medias y el desvío de las muestras; podrás observar cómo esto afecta el valor del estadístico y el p-valor.</p>
      <div id="population1"><h2>Hombres</h2>
        <p>
        Media de la población: {{population1.mean}} | Desvío de la población: {{population1.stdev}}
        </p>
        <section class="smileys">
          <div v-for="(item, index) in population1.members" :key="index" class="rack_item">
            <svg height="50" width="50">
              <rect width="50" height="50" x="0" y="0" stroke="black" fill="transparent" :class="'item_selected_'+item.selected"/>
              <SmileyViridis :cx="25" :cy="25" :radius="18" :happiness="item.v" />
            </svg>
          </div>
        </section>
        <section>
          <Graph v-slot:default="context" width="1000px" :coords="[0, 0, 400, 100]" :margin="[20, 20, 10, 20]" :grid="[10, 1]" :domain="[0, 0, nbins*10, 10]" preserveAspectRatio="none">
          <Vlines :frame="context.frame" :scale="context.scale" :delta="10"/>
          <Hlines :frame="context.frame" :scale="context.scale" :delta="1" :stroke_width="0.1"/>
          <Xaxis  :frame="context.frame" :gap="context.x_gap" :labels="[]"/>
          <Yaxis  :frame="context.frame" :gap="context.y_gap" :labels="[]"/>
          <GTitle :frame="context.frame" :margin="5" text="Muestra" />
          <g transform="translate(0,20)" >
            <YTitle :frame="context.canvas" :margin="9" text="frecuencia" />
          </g>
          <VBars  :frame="context.frame" 
            :max_total="10" 
            :thick="context.x_gap"
            :gap="0"
            :vals="current_values(histo1).map((value, index)=>(new Array(index).fill(0).concat([value])))"
            :colors="range(0,1,1.0/nbins).map(color_scale.viridis)"
            :labels="current_values(histo1).map(val=>[val])"
          />
            <g>
              <path :d="`M ${(population1.mean-5)/30.0*(400-20-10)+20} 20 L ${(population1.mean-5)/30.0*(400-20-10)+20} 80`" fill="none" stroke="red" stroke-width="1.5"/>
            </g>
          </Graph>
        </section>
      </div>
      <div :class="`population_controls p_range_${population1.p_range(population2)}`">
        <div class="statistics">
          <p>
          t de Student: {{(population1.t_student(population2)).toFixed(2)}} | p valor : <span class="p_value">{{(population1.p_value(population2)).toFixed(4)}}</span>
          </p>
          <p>
          La diferencia entre medias <span class="significance_no">no</span> es estadísticamente significativa a nivel alfa = <span class="alfa_0">0.05</span> <span class="alfa_1">0.05</span> <span class="alfa_2">0.01</span> <span class="alfa_3">0.001</span>
          </p>
        </div>
      </div>
      <div id="population2"><h2>Mujeres</h2>
        <section>
          <Graph v-slot:default="context" width="1000px" :coords="[0, 0, 400, 100]" :margin="[20, 20, 10, 20]" :grid="[10, 1]" :domain="[0, 0, nbins*10, 10]" preserveAspectRatio="none">
          <Vlines :frame="context.frame" :scale="context.scale" :delta="10"/>
          <Hlines :frame="context.frame" :scale="context.scale" :delta="1" :stroke_width="0.1"/>
          <Xaxis  :frame="context.frame" :gap="context.x_gap" :labels="[]"/>
          <Yaxis  :frame="context.frame" :gap="context.y_gap" :labels="[]"/>
          <GTitle :frame="context.frame" :margin="5" text="Muestra" />
          <g transform="translate(0,20)" >
          <YTitle :frame="context.canvas" :margin="9" text="frecuencia" />
          </g>
          <VBars  :frame="context.frame" 
            :max_total="10" 
            :thick="context.x_gap"
            :gap="0"
            :vals="current_values(histo2).map((value, index)=>(new Array(index).fill(0).concat([value])))"
            :colors="range(0,1,1.0/nbins).map(color_scale.viridis)"
            :labels="current_values(histo2).map(val=>[val])"
            />

            <g>
            <path :d="`M ${(population2.mean-5)/30.0*(400-20-10)+20} 20 L ${(population2.mean-5)/30.0*(400-20-10)+20} 80`" fill="none" stroke="red" stroke-width="1.5"/>
            </g>
          </Graph>
        </section>
        <section class="smileys">
          <div v-for="(item, index) in population2.members" :key="index" class="rack_item">
            <svg height="50" width="50">
              <rect width="50" height="50" x="0" y="0" stroke="black" fill="transparent" :class="'item_selected_'+item.selected"/>
              <SmileyViridis :cx="25" :cy="25" :radius="18" :happiness="item.v" />
            </svg>
          </div>
        </section>
      </div>
      <p>
      Media de la población: {{population2.mean}} | Desvío de la población: {{population2.stdev}}
      </p>
    </section>
  </article>
</template>

<script>
var range = require('lodash/range');
var color_scale = require('scale-color-perceptual');
import {std, mean} from 'mathjs'
import {normal} from 'jstat'
import SmileyViridis from '@/components/ui/SmileyViridis.vue'
import {linear_scale} from '@/library/linear_scale';
import {populator, Population} from '@/library/population_generator';

var population1_setup = {
  mean: 21.7,
  stdev: 5.78
}

var population2_setup = {
  mean: 22.5,
  stdev: 5.78
}

var popu = populator(70, 22, 5.6, 5, 35);
var population1 = new Population(100, population1_setup.mean, population1_setup.stdev, 5.0, 35.0);
var population2 = new Population(100, population2_setup.mean, population2_setup.stdev, 5.0, 35.0);

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
    this.stdev = std(this.values);

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

var nbins = 25;
var histo = new HistoNumbers(5, 35, nbins)

var histo1 = new HistoNumbers(5, 35, nbins)
histo1.add(population1.members.map(single=>single.x));

var histo2 = new HistoNumbers(5, 35, nbins)
histo2.add(population2.members.map(single=>single.x));

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
    var weight = Math.abs(normal.inv((1-SamplePoint.slider/100.0)/2, 0, 1));
    this.x_left = scale(avg-weight*std_error)+SamplePoint.margin_x;
    this.x_right = scale(avg+weight*std_error)+SamplePoint.margin_x;
    this.good = this.check_interval();
  }

  this.check_interval = function() {
    return this.x_left<scale(SamplePoint.avg_population)+SamplePoint.margin_x && this.x_right>scale(SamplePoint.avg_population)+SamplePoint.margin_x
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
  this.set_width();

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
SamplePoint.size = 3;
SamplePoint.slider = 95;
SamplePoint.avg_population = 22.32;

export default {
  name: 'Leccion_07a',
  title: 'Introducción',
  components: {SmileyViridis},
  data: function() {
    return {
      sample_count: 0,
      samples_size: SamplePoint.size,
      sample_points,
      SamplePoint,
      auto_sampling: false,
      auto_sampling_delay: 400,
      population1,
      population2,
      popu,
      current_sample: [],
      avg_bin: 0,
      avg: 0,
      avg1: 0,
      avg2: 0,
      avg_target1: 0,
      avg_target2: 0,
      stdev: 0,
      histo: histo,
      histo1,
      histo2,
      color_scale: color_scale,
      nbins
    }
  },
  computed: {

  },
  methods: {
    range: range,
    update_samples_size: function(value) {
      this.samples_size = value;
      sample_points.map(sample=>sample.set_width());
//      histo.reset();
//      current_histo.reset();
    },
    update_confidence: function(value) {
      SamplePoint.slider = value;
    },
    update_mean1: function(value) {
      population1.rescale(parseFloat(value));
      histo1.reset();
      histo1.add(population1.members.map(single=>single.x));
    },
    update_mean2: function(value) {
      population2.rescale(parseFloat(value));
      histo2.reset();
      histo2.add(population2.members.map(single=>single.x));
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
    current_values: function(histo) {
      var scale = 1;
      var max_y = 10;
      var raw_values = histo.edges.map(edge=>histo.freqs[edge]);
      var max_popu = Math.max(...raw_values);
      if (max_popu>max_y) {
        scale = max_y/max_popu;
      }
      var values = raw_values.map(value=>value*scale)
      return values
    },
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

.smileys {
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

text.bar_value {
  display: none;
}

.population_controls {
  display: flex;
}

.sliders input {
  width: 25rem;
}

.statistics {
  margin-left: 0.5rem;
  font-size: 1.2rem;
}

.p_range_1 .p_value::after {
  content: "*";
}

.p_range_2 .p_value::after {
  content: "**";
}

.p_range_3 .p_value::after {
  content: "***";
}

.p_range_1 .p_value, .p_range_2 .p_value, .p_range_3 .p_value {
  font-weight: bold;
}

.p_range_1 .significance_no, .p_range_2 .significance_no, .p_range_3 .significance_no {
  display: none;
}

.alfa_1, .alfa_2, .alfa_3 {
  display: none;
}

.p_range_1 .alfa_0, .p_range_2 .alfa_0, .p_range_3 .alfa_0 {
  display: none;
}

.p_range_1 .alfa_1 {
  display: inline;
}

.p_range_2 .alfa_2 {
  display: inline;
}

.p_range_3 .alfa_3 {
  display: inline;
}

</style>

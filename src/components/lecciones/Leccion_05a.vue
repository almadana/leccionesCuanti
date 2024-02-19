<template>
  <article class="lesson">
    <LessonHeader title="Muestreo" />
    <section class="lesson_body">
      <p>Aquí se puede ver una "población" representativa de los estudiantes de Cuanti, con diferentes niveles de la Escala de Satisfacción General con la Vida (ESGV). Esta "población" tiene una distribución de valores con una media y un desvío determinados. En esta lección puede explorarse la variabilidad en las medias de diferentes <b>muestras</b> de la población. En el primer panel gráfico se representa el histograma de valores de la muestra, junto con la media resultante para esa muestra (línea azul), y la media de la población (línea roja) como referencia.</p>
      <p>En el panel gráfico inferior se muestra un histograma de las diferentes medias de cada muestra realizada hasta el momento, lo que resulta, luego de tomadas varias muestras, en la <b>distribución muestral de la media</b>. Esta distribución ilustra cómo varían las medias de las diferentes muestras realizadas. En el panel de opciones puede cambiarse el tamaño de la muestra, y observar el efecto que esto tiene en el <b>error estándar</b>, es decir, en la variabilidad de las diferentes medias muestrales.</p>
      <section class="sampling">
          <span>
            Tamaño de la muestra: 
            <select name="samples_size" :value="samples_size" :disabled="auto_sampling" @input="update_samples_size($event.target.value)">
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
              <option>30</option>
              <option>50</option>
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
      <section id="population">
        <div v-for="(item, index) in population" :key="index" class="rack_item">
          <svg height="50" width="50">
            <rect width="50" height="50" x="0" y="0" stroke="black" fill="transparent" :class="'item_selected_'+item.selected"/>
            <SmileyViridis :cx="25" :cy="25" :radius="18" :happiness="item.happiness" />
          </svg>
        </div>
      </section>
      <section class="sample_info">
        Media de la muestra: {{avg.toFixed(2)}} | Tamaño de la muestra: {{samples_size}}
      </section>
      <section class="current_sample">
        <Graph v-slot:default="context" width="1000px" :coords="[0, 0, 400, 150]" :margin="[20, 30, 10, 20]" :grid="[10, 1]" :domain="[0, 0, nbins*10, 10]" preserveAspectRatio="none">
        <Vlines :frame="context.frame" :scale="context.scale" :delta="10"/>
        <Hlines :frame="context.frame" :scale="context.scale" :delta="1" :stroke_width="0.1"/>
        <Xaxis  :frame="context.frame" :gap="context.x_gap" :labels="[]"/>
        <Yaxis  :frame="context.frame" :gap="context.y_gap" :labels="[]"/>
        <GTitle :frame="context.frame" :margin="18" text="Muestra" />
        <GTitle class="frame_subtitle" :frame="context.frame" :margin="6" :text="`(media ${avg.toFixed(2)}, desvío ${stdev.toFixed(2)})`" />
        <g transform="translate(0,20)" >
          <YTitle :frame="context.canvas" :margin="9" text="frecuencia" />
        </g>
        <VBars  :frame="context.frame" 
                :max_total="10" 
                :thick="context.x_gap"
                :gap="0"
                :vals="current_values().map((value, index)=>(new Array(index).fill(0).concat([value])))"
                :colors="range(0,1,1.0/nbins).map(color_scale.viridis)"
                :labels="current_values().map(val=>[val])"
                />

          <g :transform="'translate('+ ((avg-5)*(370/(35-5))+20) +','+0+')'">
            <path :d="'M '+0+' 30 L '+0+' 130'" fill="none" stroke="blue" stroke-width="1"></path>
            <text class="valor_media" dy="140" dx="-18">
              Media {{avg.toFixed(2)}}
            </text>
          </g>
          <g :transform="'translate('+ ((22.32-5)*(370/(35-5))+20) +','+0+')'">
            <path :d="'M '+0+' 30 L '+0+' 130'" fill="none" stroke="red" stroke-width="1"></path>
          </g>
        </Graph>
      </section>
      <section>
        <Graph v-slot:default="context" width="1000px" :coords="[0, 0, 400, 150]" :margin="[20, 30, 10, 20]" :grid="[10, 1]" :domain="[0, 0, nbins*10, 200]" preserveAspectRatio="none">
          <Vlines :frame="context.frame" :scale="context.scale" :delta="10" :stroke_width="0.2"/>
          <Hlines :frame="context.frame" :scale="context.scale" :delta="20" :stroke_width="0.1"/>
          <Xaxis  :frame="context.frame" :gap="context.x_gap" :labels="[]" :stroke_width="0.4"/>
          <Yaxis  :frame="context.frame" :gap="context.y_gap" :labels="[]" :stroke_width="0.4"/>
          <g transform="translate(0,20)" >
            <YTitle :frame="context.canvas" :margin="9" text="frecuencia" />
          </g>
          <GTitle :frame="context.frame" :margin="16" text="Medias de las muestras" />
          <GTitle class="frame_subtitle" :frame="context.frame" :margin="5" :text="`(media ${histo.avg.toFixed(2)}, desvío ${histo.stdev.toFixed(2)})`" />
          <XTitle :frame="context.frame" :dy="15" :text="`Media poblacional: 22.32 | Error estándar: ${(5.78/Math.sqrt(samples_size)).toFixed(2)}`" />
          <VBars  :frame="context.frame" 
            :max_total="200" 
            :thick="context.x_gap"
            :gap="0"
            :labels="population_values().map(val=>[val])"
            :vals="population_values().map((value, index)=>(new Array(index).fill(0).concat([value])))"
            :colors="range(0,1,1.0/nbins).map(color_scale.viridis)"
          />

          <g :transform="'translate('+ ((avg-5)*(370/(35-5))+20) +','+0+')'">
            <path :d="'M '+0+' 30 L '+0+' 130'" fill="none" stroke="blue" stroke-width="1"></path>
          </g>
          <g :transform="'translate('+ ((22.32-5)*(370/(35-5))+20) +','+0+')'">
            <path :d="'M '+0+' 30 L '+0+' 130'" fill="none" stroke="red" stroke-width="1"></path>
          </g>
        </Graph>
      </section>
    </section>
  </article>
</template>

<script>
import {std, mean} from 'mathjs'
var range = require('lodash/range');
var color_scale = require('scale-color-perceptual');
import SmileyViridis from '@/components/ui/SmileyViridis.vue'
import population from '@/data/happiness.js'

var autosampling_min_delay = 100;
var autosampling_jump = 20;

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

var nbins = 15;
var histo = new HistoNumbers(5, 35, nbins)
var current_histo = new HistoNumbers(5, 35, nbins)

export default {
  name: 'Leccion_05a',
  title: 'Introducción',
  components: {SmileyViridis},
  data: function() {
    return {
      sample_count: 0,
      samples_size: 5,
      auto_sampling: false,
      auto_sampling_delay: 1000,
      population,
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
      this.samples_size = value;
      histo.reset();
      current_histo.reset();
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
      population.map(item => item.selected=false); 
      var unselected = population.slice(0);
      var selection = [];
      for (var i=0; i<this.samples_size; i++)  {
      var item = unselected.splice(Math.floor(Math.random() * unselected.length), 1)[0];
        item.selected = true;
        selection.push(item);
      }
      this.current_sample = selection.map(item=>item.raw_data);

      var sum = this.current_sample.reduce((prev, curr)=>prev+curr);
      this.avg = sum/this.current_sample.length;
      this.stdev = std(this.current_sample);
      this.avg_bin = histo.get_bin(this.avg);
      histo.add([this.avg]);
      current_histo.push(this.current_sample);
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

</style>

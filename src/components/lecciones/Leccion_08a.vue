<template>
  <article class="lesson">
    <LessonHeader title="Chi cuadrado de indepencia" />
    <h2>Datos de Latinobarómetro (ver lección tabla bivariada)</h2>
    <section class="introduction">
      <p>A continuación se reproduce la tabla de la Lección 2 (Tabla bivariada) acerca de la existencia de diferencias o conflictos entre hombres y mujeres. Si bien puede verse una clara diferencia en las respuestas entre hombres y mujeres, cabe preguntarse si esta diferencia existente en la muestra podría generalizarse a la población de la que procede (es decir, no se trata únicamente al "ruido" o variación aleatoria muestral).
      </p>
	<p>Con ese fin, en esta lección se realiza una prueba de <b>Chi cuadrado</b> de independencia. Abajo podrás ver la tabla con las frecuencias absolutas provenientes del estudio, las frecuencias esperadas si existiera independencia entre las variables, y el valor del estadístico Chi cuadrado y su p-valor asociado.</p>
<p>También podrás manipular la tabla de datos original, y ver cómo cambian el estadístico y el p-valor si los datos fueran diferentes. Por ejemplo, puedes poner la prooporción de respuestas igual entre hombres y mujeres y ver qué pasa.</p>
    </section>
    <section class="lesson_body">
      <section class="actions">
        <button @click="reset_inputs()">Resetear</button>
      </section>
      <section class="data_control" :disabled="disable_edition">
        <table class="groups_inputs">
          <thead>
            <tr>
              <th>
              </th>
              <th v-for="(corte,index) in cortes" :key="index">
                {{corte.name}}
              </th>
              <th>Totales</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(group,index) in groups" :key="index">
              <th>
                {{group.name}}
              </th>
              <td v-for="(segment,index) in group.segments" :key="index">
                <input :disabled="disable_edition" type="number" class="group_members" :min="segment.min" :max="segment.max" :value="segment.value" @input="segment_set(segment, $event)">
              </td>
              <th>
                {{group.total()}}
              </th>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Totales</th>
              <th v-for="(corte,index) in cortes" :key="index">
                {{corte.total()}}
              </th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </section>

      <section :class="`data_visualization p_range_${significance}`">
        <div class="chi">
          <table>
            <thead>
              <tr>
                <th>
                </th>
                <th :colspan="cortes.length">
                  Frecuencias esperadas
                </th>
              </tr>
              <tr>
                <th>
                </th>
                <th v-for="(corte,index) in cortes" :key="index">
                  {{corte.name}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group,index) in groups" :key="index">
                <th>
                  {{group.name}}
                </th>
                <td v-for="(segment,index) in group.segments" :key="index">
                  {{(segment.chance(population)).toFixed(2)}}
                </td>
              </tr>
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
        <div class="analysis">
          chi cuadrado: {{chi2.toFixed(2)}} || p-valor: <span class="p_value">{{pvalue.toFixed(5)}}</span>
          <p>
          La asociación entre las variables <span class="significance_no">no</span> es estadísticamente significativa a nivel alfa = <span class="alfa_0">0.05</span> <span class="alfa_1">0.05</span> <span class="alfa_2">0.01</span> <span class="alfa_3">0.001</span>
          </p>
        </div>
      </section>
    </section>
  </article>
</template>

<script>
import {chisquare} from 'jstat'

function Group(name) {
  this.total = function() {
    return this.segments.reduce((total, segment)=>total+parseInt(segment.value), 0);
  }

  this.max = function() {
    return this.segments.reduce((total, segment)=>total+segment.max, 0);
  }

  this.chance = function(total) {
    return this.total()/total
  };

  this.name = name;
  this.segments = [];
  this.values = () => this.segments.map(segment => segment.value);
  this.percents = (total, precision) => this.segments.map(segment => segment.percent(total, precision));
}

function Segment(group, corte, value) {
  this._percent = function(total) {
    return (this.value/total*100)
  }

  this.percent = function(total, precision=0) {
    return this._percent(total).toFixed(precision)
  }

  this.chance = function(total) {
    return (this.group.chance(total)*this.corte.chance(total)*total)
  };

  this.group = group;
  this.corte = corte;
  this.value = value;
}


var bar_height = 20;

Segment.add = function(group, corte, value) {
  let segment = new Segment(group, corte, value);
  group.segments.push(segment);
  corte.segments.push(segment);
  segment.min = 0;
  segment.max = 300;
}

var cortes = [
  new Group("Muy fuerte"),
  new Group("Fuerte"),
  new Group("Débil"),
  new Group("No existe"),
]

var groups = [
  new Group("Hombres"),
  new Group("Mujeres"),
]

var values = [
  [52, 183, 226, 80],
  [114, 280, 194, 58]
]

function reset_groups() {
  for (let i in groups)  {
    groups[i].segments = [];
  }
  for (let j in cortes) {
    cortes[j].segments = [];
  }
  for (let i in groups)  {
    for (let j in cortes) {
      let value = values[i][j];
      Segment.add(groups[i], cortes[j], value);
    }
  }
}

reset_groups();

var bar_width_proportion = 0.9;

export default {
  name: 'Leccion_08a',
  title: 'Introducción',
  data: function() {
    return {
      graph_width: 420,
      graph_height: 80,
      graph_margin: 10,
      graph_width_by_corte: 420,
      graph_height_by_corte: 200,
      graph_margin_by_corte: 10,
      bar_height,
      bar_thickness: 20,
      bar_gap: 10,
      bar_width: 0,
      groups,
      cortes,
      graphic_type: "by_group",
      data_type: "number",
      disable_edition: false,
    }
  },
  computed: {
    groups_reversed: function() {
      var copy = groups.slice(0);
      return copy.reverse()
    },
    max: function(group) {
      return group.segments.reduce((total, x) => total+x.max, 0)
    },
    max_group: function() {
      var max = Math.max(...groups.map(
        group => group.segments.reduce((total, x) => total+x.max, 0)
      ));
      return max
    },
    max_corte: function() {
      var max = Math.max(...cortes.map(
        group => group.segments.reduce((total, x) => total+x.max, 0)
      ));
      return max
    },
    population: function() {
      return groups.reduce((x,y)=>x+y.total(), 0);
    },
    chi2: function() {
      var total_squared = 0;
      for (var group of groups) {
        for (var segment of group.segments) {
          var fobs = segment.value;
          var fesp = segment.chance(this.population);
          total_squared += ((fobs - fesp)**2/fesp)
        }
      }
      return total_squared
    },
    pvalue: function() {
      var dof = 3;
      var x = this.chi2;
      return 1-chisquare.cdf(x, dof);
    },
    significance: function() {
      if (this.pvalue<0.001) {
        return "3"
      } else if (this.pvalue<0.01) {
          return "2"
      } else if (this.pvalue<0.05) {
        return "1"
      } else {
        return "0"
      }
    }
  },
  methods: {
    reset_inputs: function() {
      reset_groups();
    },
    edit_sliders: function() {
      this.disable_edition = false;
    },
    dedit_sliders: function() {
      this.disable_edition = true;
    },
    segment_set: function(segment, event) {
      segment.value = event.target.value;
    }
  },
  mounted: function() {
    this.bar_width = this.$el.offsetWidth*bar_width_proportion;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
table.groups_inputs {
  padding: 1em;
  margin-bottom: 1em;

  th {
    padding: 0.2em;
    text-align: right;
  }

  td {
    padding: 0.4em;
  }
}

.bars_by_corte svg {
}

.data_summary {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1em;

  .graphics {
    flex: 0 1 50%;
    margin-right: 0.4em;
  }

  table {
    flex: 0 1 50%;

    td {
      padding: 0.2em;
    }

    th {
      padding: 0.2em;
    }

    tbody th {
      text-align: right;
    }
  }
}

.data_tables {
  tbody {
    td {
      text-align: center;
    }
  }
}

.graphics {
  padding: 0;
}

.graphics svg {
  margin: 0;
  border: solid 1px;
}

svg {
  background: lightyellow;
}

.introduction {
  text-align: justify;
}

.graphic_type {
  text-align: center;
}

.data_control {
  padding: 0.2em;
}

.data_control[disabled="disabled"] {
  background: #eee;
}

.question_options input {
  margin-right: 0.2em;
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

.data_visualization table th {
  padding: 0.2rem;
}

.data_visualization table td {
  padding: 0.2rem;
}

.analysis {
  margin-top: 1rem;
}
</style>

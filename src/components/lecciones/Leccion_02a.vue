<template>
  <article class="lesson">
    <LessonHeader title="Tabla de frecuencias bivariada" />
    <h2>Introducción</h2>
    <section class="introduction">
      <p>
        La Encuesta Latinobarómetro en su edición de  2017 indaga sobre la percepción de las personas acerca de la existencia de diferencias o conflictos entre grupos sociales (entre ricos y pobres, entre hombres y mujeres, personas viejas y la sociedad, etc.). Los datos para Uruguay indican que 9 de cada 10 uruguayos consideran que existe conflicto entre hombres y mujeres. Mientras que el 52% considera que ese conflicto es muy fuerte o fuerte, el 36% considera que existe, pero es débil. Si se consideran las diferencias en las respuestas según sexo de los entrevistados, la percepción del conflicto tiende a ser mayor entre las mujeres. El 60% de las mujeres considera que existe un conflicto fuerte o muy fuerte, mientras que entre la población masculina es el 43% que así lo considera. Si se consideran solamente aquellas personas que no perciben la existencia de conflicto, la mayoría son hombres (representan el 58% del total).
      </p>
      <p>
        En esta lección se muestra la tabla de frecuencias absolutas resultante para estas variables. Más abajo se muestra una tabla de porcentajes y un gráfico de barras. Puedes manipular algunos aspectos de la construcción de la tabla y los gráficos usando los controles web. En base a las tablas de obtenidas, intenta responder las preguntas que se muestran más abajo.
      </p>
      <p>
      Cuando termines, prueba la <a class="link" @click="$emit('load_lesson', Leccion_2b)">versión editable de esta lección.</a>
      </p>
    </section>
    <section class="lesson_body">
      <section class="actions">
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

      <section class="data_visualization">
        <div class="graphic_type">
          Hacer corte por
          <select name="graphic_type" v-model="graphic_type">
            <option value="by_group">sexo</option>
            <option value="by_corte">nivel de conflicto</option>
          </select>
        </div>
        <div class="data_type">
          Graficar 
          <select name="data_type" v-model="data_type">
            <option value="number">valores absolutos</option>
            <option value="percent">porcentajes</option>
          </select>
        </div>

        <section class="data_summary bars_by_group" v-if="graphic_type=='by_group'">

          <div class="graphics">
            <Graph v-slot:default="context" :coords="[0, 0, 400, 200]" :margin="[10, 20, 10, 10]" :padding="[20,10,0,20]" :grid="[10, 10]" :domain="[0, 0, max_group, 100]" width="100%" preserveAspectRatio="xMinYMax meet">
              <Vlines :frame="context.canvas" :scale="context.scale" :delta="50"/>
              <Xaxis  :frame="context.canvas" :gap="context.x_gap" :labels="[]"/>
              <YTitle :frame="context.frame" :gap="context.y_gap" :margin="0" text="sexo" />
              <Yaxis  :frame="context.canvas" :gap="context.y_gap" :labels="[]"/>
              <g v-if="data_type=='number'">
                <GTitle :frame="context.frame" :margin="4" text="Valores por sexo" />
                <XTitle :frame="context.frame" :gap="context.y_gap" text="valores absolutos" />
                <HBars  :frame="context.canvas" 
                        :max_total="max_group" 
                        :thick="3*context.y_gap" 
                        :gap="0.5*context.y_gap" 
                        :vals="groups_reversed.map(group=>group.values())" 
                />
              </g>
              <g v-if="data_type=='percent'">
                <GTitle :frame="context.frame" :margin="4" text="Porcentajes por sexo" />
                <XTitle :frame="context.frame" :gap="context.y_gap" text="porcentajes" />
                <HBars  :frame="context.canvas" 
                        :max_total="100" 
                        :thick="3*context.y_gap" 
                        :gap="0.5*context.y_gap"
                        :vals="groups_reversed.map(group=>group.percents(group.total(), 10))"
                        :labels="groups_reversed.map(group=>group.percents(group.total()))"
                />
              </g>
              <YLabels :frame="context.canvas" :margin="4" :thick="3*context.y_gap" :gap="0.5*context.y_gap" :labels="groups_reversed.map(group=>group.name)" />
              <GLegend :frame="context.frame" :width="65" :height="13*cortes.length" :labels="cortes.map(corte=>corte.name)" :xmargin="5" :ymargin="5" />
            </Graph>
          </div>

          <div class="data_tables">
            <table>
              <thead>
                <tr>
                  <th :colspan="cortes.length+2">
                    Tabla de porcentajes
                  </th>
                </tr>
                <tr>
                  <th>
                  </th>
                  <th :colspan="cortes.length">
                    Nivel de conflicto
                  </th>
                  <th></th>
                </tr>
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
                    {{segment.percent(segment.group.total(), 1)}}
                  </td>
                  <th>
                    100
                  </th>
                </tr>
              </tbody>
              <tfoot>
              </tfoot>
            </table>
          </div>
        </section>

        <section>
        </section>
        <section class="data_summary bars_by_corte" v-if="graphic_type=='by_corte'">

          <div class="graphics">
            <Graph v-slot:default="context" :coords="[0, 0, 400, 200]" :margin="[10, 20, 10, 10]" :padding="[20,10,0,20]" :grid="[10, 10]" :domain="[0, 0, 400, max_corte]" width="100%" preserveAspectRatio="xMinYMax meet">
              <Hlines :frame="context.canvas" :scale="context.scale" :delta="50"/>
              <Xaxis  :frame="context.canvas" :gap="context.x_gap" :labels="[]"/>
              <Yaxis  :frame="context.canvas" :gap="context.y_gap" :labels="[]"/>
              <XTitle :frame="context.frame" :gap="context.y_gap" text="nivel de conflicto" />
              <g v-if="data_type=='number'">
                <GTitle :frame="context.frame" :margin="4" text="Valores por nivel de conflicto" />
                <YTitle :frame="context.frame" :gap="context.y_gap" text="valores absolutos" />
                <VBars  :frame="context.canvas"
                        :max_total="max_corte" 
                        :thick="6*context.x_gap" 
                        :gap="context.x_gap" 
                        :vals="cortes.map(corte=>corte.values().reverse())" 
                />
              </g>
              <g v-if="data_type=='percent'">
                <GTitle :frame="context.frame" :margin="4" text="Porcentajes por nivel de conflicto" />
                <YTitle :frame="context.frame" :gap="context.y_gap" text="porcentaje" />
                <VBars
                        :frame="context.canvas" 
                        :max_total="100" 
                        :thick="6*context.x_gap"
                        :gap="context.x_gap"
                        :vals="cortes.map(corte=>corte.percents(corte.total(), 10).reverse())"
                        :labels="cortes.map(corte=>corte.percents(corte.total()).reverse())"
                />
              </g>
              <XLabels :frame="context.canvas" :margin="12" :thick="6*context.x_gap" :gap="context.x_gap" :labels="cortes.map(corte=>corte.name)" />
              <GLegend :frame="context.frame" :width="7*context.x_gap" :height="14*groups.length" :labels="groups_reversed.map(group=>group.name)" :xmargin="5" :ymargin="5" />
            </Graph>

          </div>

          <div class="data_tables">
            <table>
              <thead>
                <tr>
                  <th :colspan="cortes.length+2">
                    Tabla de porcentajes
                  </th>
                </tr>
                <tr>
                  <th>
                  </th>
                  <th :colspan="cortes.length">
                    Nivel de conflicto
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
                    {{segment.percent(segment.corte.total(), 1)}}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>
                    Total
                  </th>
                  <th v-for="(corte,index) in cortes" :key="index">
                    100
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </section>
    </section>

    <section class="questions">
      <h2>Preguntas</h2>
      <section v-for="(question, index_i) in questions" :key="index_i" class="question" @click="question.clicked()">
        <p class="question_text">
        {{question.text()}}
        </p>
        <p v-if="question.type=='multiple_choice'" class="question_options">
          <button v-for="(option, index_j) in question.options" :key="index_j" :value="option.value" :class="{[question.status]: true, selected: option.selected}" :disabled="question.answered" @click="question.check(option)">{{option.text}}</button><span class="question_feedback">{{question.feedback[question.status]}}</span>
        </p>
        <p v-if="question.type=='fill'" class="question_options">
          <input v-model="question.response"/>
          <button @click="question.check()">Comprobar respuesta</button>
          <span class="question_feedback">{{question.feedback[question.status]}}</span>
        </p>
      </section>
    </section>
    <section class="next_lesson">
      <a href="#">Siguiente</a>
    </section>
  </article>
</template>

<script>
var shuffle = require('lodash/shuffle');
import {Question} from '@/library/question';

import Leccion_2b from '@/components/lecciones/Leccion_02b.vue'

function Group(name) {
  this.total = function() {
    return this.segments.reduce((total, segment)=>total+parseFloat(segment.value), 0);
  }

  this.max = function() {
    return this.segments.reduce((total, segment)=>total+segment.max, 0);
  }

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

var questions =  shuffle([
  new Question({ text: ()=>`¿Qué porcentaje de las mujeres opinan que el nivel de conflicto es fuerte?.`,
    type: "fill",
    answer: ()=>`${ groups[1].segments[1].percent(groups[1].segments[1].group.total()) }`,
    response: 0,
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function() {
      if (
        parseFloat(this.response.replace(",", "."))==parseFloat(this.answer())
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`¿Qué porcentaje de los hombres opina que el nivel de conflicto es débil?`,
    type: "fill",
    answer: ()=>`${ groups[0].segments[2].percent(groups[0].segments[2].group.total()) }`,
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function() {
      if (
        parseFloat(this.response.replace(",", "."))==parseFloat(this.answer())
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`¿Qué porcentaje de los hombres opina que el nivel de conflicto es fuerte o muy fuerte?`,
    type: "fill",
    answer: ()=>`${ parseFloat(groups[0].segments[0].percent(groups[0].segments[0].group.total(),1)) + parseFloat(groups[0].segments[1].percent(groups[0].segments[1].group.total(),1)) }`,
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function() {
      if (
        parseFloat(this.response.replace(",", "."))==parseFloat(this.answer())
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`¿Qué porcentaje de las personas que opinan que el nivel de conflicto es fuerte es mujer?`,
    type: "fill",
    answer: ()=>`${ cortes[1].segments[1].percent(cortes[1].segments[1].corte.total()) }`,
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function() {
      if (
        parseFloat(this.response.replace(",", "."))==parseFloat(this.answer())
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`La mayoría  de los hombres opina que el nivel del conflicto es débil o inexistente. ¿Verdadero o falso?.`,
    type: "multiple_choice",
    options: [
      {text: "Verdadero", value: "true" },
      {text: "Falso", value: "false" }
    ],
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function(option) {
      if (
        option.value=="true" && (groups[0].segments[2]._percent(groups[0].segments[2].group.total()) + groups[0].segments[3]._percent(groups[0].segments[3].group.total()))>50
        ||
        option.value=="false" && (groups[0].segments[2]._percent(groups[0].segments[2].group.total()) + groups[0].segments[3]._percent(groups[0].segments[3].group.total()))<=50
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`Menos del 25% de las mujeres opina que el nivel de conflicto es fuerte. ¿Verdadero o falso?.`,
    type: "multiple_choice",
    options: [
      {text: "Verdadero", value: "true" },
      {text: "Falso", value: "false" }
    ],
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function(option) {
      if (
        option.value=="true" && groups[1].segments[1]._percent(groups[1].segments[1].group.total())<25
        ||
        option.value=="false" && groups[1].segments[1]._percent(groups[1].segments[1].group.total())>=25
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`Entre los que opinan que el nivel de conflicto es muy fuerte, hay más del doble de mujeres que de hombres. ¿Verdadero o falso?.`,
    type: "multiple_choice",
    options: [
      {text: "Verdadero", value: "true" },
      {text: "Falso", value: "false" }
    ],
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function(option) {
      if (
        option.value=="true" && 2*cortes[0].segments[0].value<cortes[0].segments[1].value
        ||
        option.value=="false" && 2*cortes[0].segments[0].value>=cortes[0].segments[1].value
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`Entre los que opinan que el conflicto no existe, hay más mujeres. ¿Verdadero o falso?.`,
    type: "multiple_choice",
    options: [
      {text: "Verdadero", value: "true" },
      {text: "Falso", value: "false" }
    ],
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function(option) {
      if (
        option.value=="true" && cortes[3].segments[1].value>cortes[3].segments[1].value
        ||
        option.value=="false" && cortes[3].segments[1].value<=cortes[3].segments[1].value
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
]);

export default {
  name: 'Leccion_02a',
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
      questions,
      disable_edition: true,
      Leccion_2b,
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
  },
  methods: {
    reset_inputs: function() {
      reset_groups();
      questions.map(question=>question.reset())
    },
    edit_sliders: function() {
      this.disable_edition = false;
      questions.map(question=>question.reset())
    },
    dedit_sliders: function() {
      this.disable_edition = true;
      questions.map(question=>question.reset())
    },
    segment_set: function(segment, event) {
      segment.value = event.target.value;
      questions.map(question=>question.reset())
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

.question_feedback {
  background: yellow;
}

.question_options button {
  background: #eee;
  padding: 0.4em;
}

.question {
  border-top: solid 1px;
}

.question_options button.selected {
  background: lightyellow;
  border: solid 1px;
  color: black;
}

.question_options button.selected.right {
  background: lightgreen;
}

.question_options button.selected.wrong {
  background: #fbb;
}

.question_feedback {
  margin-left: 0.2em;
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

.next_lesson {
  border-top: 1px solid;
  padding-top: 0.5em;
  font-weight: bold;
  text-align: right;
}
</style>

<template>
  <article class="lesson">
    <LessonHeader title="Tabla de frecuencias univariada" />
    <section class="introduction">
      <h2>Versión editable</h2>
      <p>
      Ahora puedes modificar libremente los valores originales de la encuesta, y ver cómo esos cambios afectan a la tabla y el gráfico resultantes.
      <ul><li>En base a las tablas de obtenidas, intenta responder las preguntas que se muestran más abajo.</li></ul>
      </p>
    </section>
    <section class="lesson_body">
      <section class="actions">
        <button @click="reset_sliders()">Resetear</button>
      </section>
      <section class="data_control" :disabled="disable_slider_edition">
        <section class="sliders">
          <Slider v-for="group in groups" 
                  :key="group.code"
                  :code="group.code"
                  :tag="group.name"
                  :id="'slider_group'+group.code"
                  :min="group.min"
                  :max="group.max"
                  :step="group.step"
                  :value="group.value"
                  :disabled="disable_slider_edition"
                  @input="slider_set(group,$event)"
                  />
        </section>


        <section id="stacked_bars" class="bars">
          <div class="data_graph">
            <Graph v-slot:default="context" :coords="[0, 0, 400, 150]" :margin="[10, 20, 10, 10]" :padding="[0,0,0,0]" :grid="[10, 10]" :domain="[0, 0, 400, 750]" width="100%" preserveAspectRatio="xMinYMax meet">
            <Hlines :frame="context.canvas" :scale="context.scale" :delta="50"/>
            <Xaxis  :frame="context.canvas" :gap="context.x_gap" :labels="[]"/>
            <g>
            <GTitle :frame="context.frame" :margin="4" text="Grado de satisfacción con la vida" />
            <VBars  :frame="context.canvas"
              :max_total="750" 
              :thick="6*context.x_gap" 
              :gap="context.x_gap" 
              :vals="group_values.map((value, index)=>(new Array(index).fill(0).concat([value])))"
              :colors="['#993333', '#339933', '#333399','#000000']"
            />
            </g>
            <GLegend :frame="context.frame" :width="11*context.x_gap" :height="14*groups.length" :labels="groups.map(group=>group.name)" :xmargin="5" :ymargin="5" />
            </Graph>
          </div>
          <div class="data_table">
            <table id="statistics_summary">
              <thead>
                <tr>
                  <th>Grado de satisfacción con la vida</th>
                  <th>Frecuencia absoluta</th>
                  <th>Frecuencia relativa</th>
                  <th>Frecuencia relativa en porcentaje</th>
                  <th>Frecuencia relativa acumulada</th>
                  <th>Frecuencia relativa acumulada en porcentaje</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(group,index) in groups" :key="index">
                  <th class="row_name">{{group.name}}</th>
                  <th class="freq_abs"><input type="number" min="0" max="group.max" :value="group.value" :disabled="disable_slider_edition" @input="group.push($event.target.value)"/></th>

                  <td class="freq_rel">{{group.freq_rel}}</td>
                  <td class="freq_rel_percent">{{group.freq_rel_percent}}</td>
                  <td class="freq_rel_accum">{{group.freq_rel_accum}}</td>
                  <td class="freq_rel_accum_percent">{{group.freq_rel_accum_percent}}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>Totales</th>
                  <td>{{group_total}}</td>
                  <td>1</td>
                  <td>100</td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
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
    </section>
  </article>
</template>

<script>
var shuffle = require('lodash/shuffle');
import {Question} from '@/library/question';

function Group(params) {
  this.push = function(new_value) {
    var delta = new_value - this.value;
    Group.total += delta;
    this.value  += delta;
    Group.sync_all();
  }

  this.sync = function() {
    this._freq_rel = (this.value/Group.total);
    this.freq_rel = this._freq_rel.toFixed(3);
    this._freq_rel_percent = this._freq_rel*100;
    this.freq_rel_percent = this._freq_rel_percent.toFixed(1);

    var accum = this.prev ? this.prev._freq_rel_accum : 0;
    this._freq_rel_accum = accum + this._freq_rel;
    this.freq_rel_accum = this._freq_rel_accum.toFixed(3);

    this._freq_rel_accum_percent = this._freq_rel_accum*100;
    this.freq_rel_accum_percent = this._freq_rel_accum_percent.toFixed(1);
  }

  Object.assign(this, params);
  this.prev = Group.prev;

  Group.total+=this.value;
  Group.prev = this;
  Group.groups.push(this);

  Group.sync_all();
}

Group.total = 0.0;
Group.groups = [];
Group.sync_all = function() {
  for (var group of Group.groups) {
    group.sync();
  }
}

var bar_width_proportion = 0.9;

var groups_params = [
  {name: 'Para nada satisfecho', code: 0, min: 0, max: 750, value: 37, step: 1},
  {name: 'No muy satisfecho', code: 1, min: 0, max: 750, value: 230, step: 1},
  {name: 'Bastante satisfecho', code: 2, min: 0, max: 750, value: 668, step: 1},
  {name: 'Muy satisfecho', code: 3, min: 0, max: 750, value: 264, step: 1},
];

for (var param of groups_params) {
  new Group(param);
}

var questions =  shuffle([
  new Question({ text: ()=>"La mayoría de las personas dice estar para nada satisfecha con la vida. ¿Verdadero o falso? ",
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
        option.value=="true" && Group.groups[0].freq_rel>0.5
        ||
        option.value=="false" && Group.groups[0].freq_rel<=0.5
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`¿Qué porcentaje de las personas dice estar por lo menos bastante satisfecha con la vida?`,
    type: "fill",
    answer: () => `${parseFloat(Group.groups[2].freq_rel_percent)+parseFloat(Group.groups[3].freq_rel_percent)}`,
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function() {
      if (
        parseFloat(this.response)==parseFloat(this.answer())
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text: ()=>`¿Qué porcentaje de las personas reporta un nivel de satisfacción "no muy satisfecho" o menor?.`,
    type: "fill",
    answer: () => `${Group.groups[1].freq_rel_accum_percent}`,
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function() {
      if (
        parseFloat(this.response)==parseFloat(this.answer())
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
  new Question({ text:()=> `Menos de un tercio de las personas reporta estar muy satisfecho con la vida. ¿Verdadero o falso?`,
    type: "multiple_choice",
    options: [
      {text: "Verdadero", value: "true"},
      {text: "Falso", value: "false"}
    ],
    feedback: {
      right: "Correcto!",
      wrong: "Incorrecto :("
    },
    validate: function(option) {
      if (
        option.value=="true" && Group.groups[3].freq_rel<1/3.0
        ||
        option.value=="false" && Group.groups[3].freq_rel>=1/3.0
      ) {
        this.status = "right";
      } else {
        this.status = "wrong";
      }
    }
  }),
]);

export default {
  name: 'Leccion_01b',
  title: 'Editable',
  data: function() {
    return {
      groups: Group.groups,
      bar_height: 200,
      bar_width: 0,
      disable_slider_edition: false,
      questions,
    }
  },
  computed: {
    max_group: function() {
      return this.groups.reduce((total, x) => total+x.max, 0)
    },
    group_total: function() {
      return this.groups.reduce((total, x) => total+parseInt(x.value), 0)
    },
    group_values: function () {
      return this.groups.map(item=>item.value)
    }
  },
  methods: {
    reset_sliders: function() {
      Group.groups.map((group,i)=>group.value=groups_params[i].value)
      questions.map(question=>question.reset())
    },
    edit_sliders: function() {
      this.disable_slider_edition = false;
      questions.map(question=>question.reset())
    },
    dedit_sliders: function() {
      this.disable_slider_edition = true;
      questions.map(question=>question.reset())
    },
    slider_set: function(group, event) {
      questions.map(question=>question.reset())
      group.push(event)
    }
  },
  mounted: function() {
    this.bar_width = this.$el.offsetWidth*bar_width_proportion;
  }
}
</script>

<style lang="scss" scoped>
.bars {
  text-align: center;
}

table {
  table-layout: auto;
  width: 100%;
  border-collapse: collapse;
  border: solid 3px;
}

th {
  border: solid 1px;
  padding: 0.2em;
}

tbody th {
  text-align: right;
}

td {
  border: solid 1px;
  padding: 0.2em;
}

#stacked_bars {
  margin-bottom: 1em;
  width: 100%;
  height: 100%;

  display: flex;

  div {
    margin: 5px;
  }

  .data_graph {
    flex: 1 1 200px;

    svg {
      height: 100%;
      min-height: 200px;
      display: none;
    }
  }

  .data_table {
    flex: 0 1 10em;
  }

}

.introduction {
}

.data_control {
  padding: 0.2em;
}

.data_control[disabled="disabled"] {
  background: #eee;
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

.next_lesson {
  border-top: 1px solid;
  padding-top: 0.5em;
  font-weight: bold;
  text-align: right;
}

</style>

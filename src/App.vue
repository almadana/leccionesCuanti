<template>
  <div id="app">
    <nav class="lesson_list">
      <h1>Lecciones</h1>
      <ul>
        <li class="chapter">
          <a @click="current_lesson=all_lessons[0]">
            Hola!
          </a>
        </li>
        <li :key="index" v-for="(chapter, index) in chapters_enabled" class="chapter">
          {{chapter}}
          <ul class="chapter_lessons">
            <li :key="lesson.name" v-for="lesson in chapters[chapter]">
              <a @click="current_lesson=lesson">
                {{lesson.title}}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <LandingPage v-if="current_lesson==all_lessons[0]" @load_lesson="current_lesson=$event"/>
    <Leccion_1a v-if="current_lesson==all_lessons[1]" @load_lesson="current_lesson=$event"/>
    <Leccion_1b v-if="current_lesson==all_lessons[2]" @load_lesson="current_lesson=$event"/>
    <Leccion_2a v-if="current_lesson==all_lessons[3]" @load_lesson="current_lesson=$event"/>
    <Leccion_2b v-if="current_lesson==all_lessons[4]" @load_lesson="current_lesson=$event"/>
    <Leccion_3a v-if="current_lesson==all_lessons[5]" @load_lesson="current_lesson=$event"/>
    <Leccion_3b v-if="current_lesson==all_lessons[6]" @load_lesson="current_lesson=$event"/>
    <Leccion_5a v-if="current_lesson==all_lessons[7]" @load_lesson="current_lesson=$event"/>
    <Leccion_6a v-if="current_lesson==all_lessons[8]" @load_lesson="current_lesson=$event"/>
    <Leccion_7a v-if="current_lesson==all_lessons[9]" @load_lesson="current_lesson=$event"/>
    <Leccion_7b v-if="current_lesson==all_lessons[10]" @load_lesson="current_lesson=$event"/>
    <Leccion_7c v-if="current_lesson==all_lessons[11]" @load_lesson="current_lesson=$event"/>
    <Leccion_7d v-if="current_lesson==all_lessons[12]" @load_lesson="current_lesson=$event"/>
    <Leccion_8a v-if="current_lesson==all_lessons[13]" @load_lesson="current_lesson=$event"/>
    <Leccion_9a v-if="current_lesson==all_lessons[14]" @load_lesson="current_lesson=$event"/>
  </div>
</template>

<script>
import LandingPage from './components/LandingPage.vue'
import Leccion_1a from './components/lecciones/Leccion_01a.vue'
import Leccion_1b from './components/lecciones/Leccion_01b.vue'
import Leccion_2a from './components/lecciones/Leccion_02a.vue'
import Leccion_2b from './components/lecciones/Leccion_02b.vue'
import Leccion_3a from './components/lecciones/Leccion_03a.vue'
import Leccion_3b from './components/lecciones/Leccion_03b.vue'
import Leccion_5a from './components/lecciones/Leccion_05a.vue'
import Leccion_6a from './components/lecciones/Leccion_06a.vue'
import Leccion_7a from './components/lecciones/Leccion_07a.vue'
import Leccion_7b from './components/lecciones/Leccion_07b.vue'
import Leccion_7c from './components/lecciones/Leccion_07c.vue'
import Leccion_7d from './components/lecciones/Leccion_07d.vue'
import Leccion_8a from './components/lecciones/Leccion_08a.vue'
import Leccion_9a from './components/lecciones/Leccion_09a.vue'

//import setup from './setups/production.js'
import setup from './setups/testing.js'

export default {
  name: 'app',
  components: {
    LandingPage, Leccion_1a, Leccion_1b, Leccion_2a, Leccion_2b, Leccion_3a, Leccion_3b, Leccion_5a, Leccion_6a, Leccion_7a, Leccion_7b, Leccion_7c, Leccion_7d, Leccion_8a, Leccion_9a
  },
  data: function () {
    return {
      all_lessons: [
        LandingPage,
        Leccion_1a,
        Leccion_1b,
        Leccion_2a,
        Leccion_2b,
        Leccion_3a,
        Leccion_3b,
        Leccion_5a,
        Leccion_6a,
        Leccion_7a,
        Leccion_7b,
        Leccion_7c,
        Leccion_7d,
        Leccion_8a,
        Leccion_9a,
      ],
      chapters: {
        "1-Tabla univariada": [Leccion_1a, Leccion_1b],
        "2-Tabla bivariada": [Leccion_2a, Leccion_2b],
        "3-Media y desvío": [Leccion_3a, Leccion_3b],
        "4-Muestreo": [Leccion_5a],
        "5-Intervalo de confianza": [Leccion_6a],
        "6-Prueba t": [Leccion_7a, Leccion_7b, Leccion_7c, Leccion_7d],
        "7-Chi cuadrado de independencia": [Leccion_8a],
        "8-Correlación": [Leccion_9a],
      },
      chapters_enabled: setup.chapters_enabled,
      current_lesson: LandingPage,
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  margin-top: 1em;
  margin-left: 1em;

  display: flex;
}

nav {
  margin-right: 0.4em;

  ul {
    list-style-type: none;
    padding: 0;
  }
}

article.lesson {
  margin: 1em;
  flex: 1 1 10em;
}

.lesson_body {
  padding: 1em;
}

li.chapter {
  padding-bottom: 0.5em;
}

ul.chapter_lessons {
  padding-left: 0.5em;

  a {
    text-decoration: underline;
    cursor: pointer;
  }
}

a {
  text-decoration: underline;
  cursor: pointer
}

.lesson_list {
  border-right: 1px solid;
  padding-right: 0.5em;
}
</style>

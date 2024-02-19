<template>
  <nav class="lesson_list">
    <h1>Lecciones</h1>
    <ul>
      <li :key="lesson.name" v-for="lesson in lessons">
        <a @click="$emit('load_lesson', lesson)">
          {{lesson.title}}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  props: ['lessons']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: underline;
  cursor: pointer
}

.lesson_list {
  border-right: solid 1px;
  padding-right: 0.5em;
}

li {
  margin-top: 0.2em;
}
</style>

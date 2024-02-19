<template>
  <header class="lesson_header">
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  name: 'Leccion',
  props: {
    title: String
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>

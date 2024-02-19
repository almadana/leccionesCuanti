<template>
  <article class="lesson">
    <h1>Hola!</h1>
    <p>
    En este sitio encontrarán algunas "lecciones" sobre temas del curso "Métodos y Técnicas Cuantitativas", del módulo metodológico del plan de estudios de la Licenciatura en Psicología de la Universidad de la República.
    </p>
    <p>
    Se trata de contenidos interactivos que buscan ilustrar algunos conceptos o herramientas utilizadas en la estadística descriptiva e inferencial, funcionando como complemento de las actividades en aula.
    </p>
    <p>
    Este sitio, así como el <a href="http://cuanti.psico.edu.uy/panel">"Panel de análisis de datos"</a> forman parte del proyecto de la Comisión Sectorial de Enseñanza, modalidad Innovación 2018 "Herramientas web para la enseñanza de la estadística en psicología: integración de recursos para modalidad presencial, semi-presencial y virtual", cuyo responsable es Álvaro Cabana.
    </p>
    <p>
    Créditos:<br/>
    Programación: Alfonso Pérez<br/>
    Diseño de contenidos: Álvaro Cabana, Dominique Kessel, Victor Ortuño, Carolina Guidotti<br/>
    Por consultas escribir a: <a href="mailto:acabana@psico.edu.uy">acabana@psico.edu.uy</a><br/>
    </p>
    <div class="sponsors_logos">
      <div class="logo">
        <img :src="logo_psico" alt="Logo Facultad de Psicología"/>
      </div>
      <div class="logo">
        <img :src="logo_cse" alt="Logo CSE"/>
      </div>
    </div>
  </article>
</template>

<script>
import logo_psico from '@/assets/images/logo_psico.png'
import logo_cse from '@/assets/images/logo_cse.png'

export default {
  name: 'LandingPage',
  title: 'landingpage',
  data: function() {
    return {
      logo_psico,
      logo_cse,
    }
  },
}
</script>

<style lang="scss" scoped>
.sponsors_logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .logo {
    flex: 0 1 auto;

    img {
      max-height: 200px;
      margin: 5px;
      width: 100%;
      display: block;
    }
  }
}
</style>

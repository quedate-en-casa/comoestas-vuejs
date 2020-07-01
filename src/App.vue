<template>
  <div id="app" class="container pl-5 pr-5">
    <div class="is-absolute">
      <label class="checkbox">
        <input type="checkbox" v-model="view">
        {{view?'Vista medico':'Vista familiar'}}
      </label>
    </div>
    <img alt="Vue logo" height="50" width="50" src="./assets/logo.png">
    <div>
      <span class="title is-4">
        ¿Como estas?
      </span>
      <div class="mb-5">
        <span class="subtitle">
            “Aunque no podemos visitarte, podemos saber Cómo Estás”
        </span>
      </div>

    </div>
    <Form v-if="view"/>
    <Consult v-if="!view"/>
  </div>
</template>

<script>
  import Form from './components/Form.vue'
  import Consult from './components/Consult.vue'

  export default {
    name: 'App',
    data() {
      return {
        view : true
      }
    },
    components: {
      Form,
      Consult
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  body,
  html {
    background-color: #E8E9E8E9 !important;
  }
</style>
<template>
  <div id="app">

    <data-analysis>
    </data-analysis>

  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld'
  import DataAnalysis from './components/data-analysis';

  export default {
    name: 'App',
    components: {
      DataAnalysis,
      HelloWorld
    }
  }
</script>

<style>
</style>

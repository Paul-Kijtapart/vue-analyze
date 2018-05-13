<template>
  <div id="app">

    <data-analysis :initialX="[1,2,3,4,5,6]"
                   :initialY="[4862.4, 5294.7, 5934.5, 7171.0, 8964.4,20]">
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

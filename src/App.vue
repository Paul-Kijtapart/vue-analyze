<template>
  <div id="app">

    <!--<simple-data-analysis :initialX="[1,2,3,4,5,6]"-->
    <!--:initialY="[4862.4, 5294.7, 5934.5, 7171.0, 8964.4,20]">-->
    <!--</simple-data-analysis>-->

    <!--<data-analysis :initialBaseline="baseline"-->
    <!--:initialDriver="driver">-->
    <!--</data-analysis>-->

    <pro-data-analysis :initialBaseline="baseline"
                       :initialDriver="driver">
    </pro-data-analysis>

  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld'
  import {
    DataAnalysis,
    SimpleDataAnalysis,
    ProDataAnalysis
  } from './components/data-analysis';

  export default {
    name: 'App',
    components: {
      SimpleDataAnalysis,
      DataAnalysis,
      HelloWorld,
      ProDataAnalysis
    },
    data: function () {
      return {
        baseline: {
          name: 'My Baseline',
          series: {
            datetime: [20, 30, 40, 50, 60, 70],
            val: [1, 2, 3, 4, 5, 6]
          }
        },

        driver: {
          name: 'My Driver',
          series: {
            datetime: [20, 30, 40, 50, 60, 70],
            val: [4862.4, 5294.7, 5934.5, 7171.0, 8964.4, 20]
          }
        }
      };
    }
  }
</script>

<style>
</style>

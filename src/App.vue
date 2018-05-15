<template>
  <div id="app">

    <!--<simple-data-analysis :initialX="[1,2,3,4,5,6]"-->
    <!--:initialY="[4862.4, 5294.7, 5934.5, 7171.0, 8964.4,20]">-->
    <!--</simple-data-analysis>-->

    <!--<data-analysis :initialBaseline="baseline"-->
    <!--:initialDriver="driver">-->
    <!--</data-analysis>-->

    <data-analysis :initialBaseline="happinessSerie"
                   :initialDrivers="[foodSerie, travelSerie]">
    </data-analysis>

  </div>
</template>

<script>

  // models
  import {
    DataAnalysis
  } from './components/data-analysis';

  export default {
    name: 'App',
    components: {
      DataAnalysis
    },
    data: function () {
      return {
        happinessSerie: {
          name: 'Happiness',
          series: {
            datetime: [20, 30, 40, 50, 60, 70],
            val: [1, 2, 3, 4, 5, 6]
          }
        },

        foodSerie: {
          name: 'Food',
          series: {
            datetime: [20, 30, 40, 50, 60, 70],
            val: [4862.4, 5294.7, 5934.5, 7171.0, 8964.4, 20]
          }
        },
        travelSerie: {
          name: 'Travel',
          series: {
            datetime: [20, 30, 40, 50, 60, 70],
            val: [100, 300, 50, 500, 700, 20]
          }
        }
      };
    }
  }
</script>

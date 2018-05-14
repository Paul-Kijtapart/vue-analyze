<template>
  <div class="data-analysis">

    <!-- Chart display -->
    <chart ref="chart"
           :options="chartOptions"
           :auto-resize="true"
           @click="handleChartClick">
    </chart>

  </div>
</template>

<script>

  // libraries
  import SimpleLinearRegression from 'ml-regression-simple-linear';

  export default {
    name: "data-analysis",
    props: {
      datetimes: {
        type: Array,
        required: false
      }, // e.g.
      initialX: {
        type: Array,
        required: true
      }, // e.g.  const x = [0.5, 1, 1.5, 2, 2.5];
      initialY: {
        type: Array,
        required: true
      }, // e.g.  const y = [0, 1, 2, 3, 4];
    },
    data: function () {
      return {

        x: this.initialX,
        y: this.initialY,

        // display updated data
        chartOptions: {
          xAxis: {},
          yAxis: {},
          series: [{
            symbolSize: 20,
            data: [],
            type: 'scatter'
          }]
        }
      };
    },
    computed: {

      scatterPoints: function () {
        let points = [];

        for (let i = 0; i < this.x.length; i++) {

          points.push([this.x[i], this.y[i]]);

        }

        return points;
      },

      regression: function () {

        return new SimpleLinearRegression(this.x, this.y);
      },

      regressionPoints: function () {

        // calculate regression line's points based on the function, x, and y

        let {slope, intercept, coefficients} = this.regression;

        return this.x.map(val => {
          return [val, slope * val + intercept];
        })
      }
    },
    watch: {

      scatterPoints: {
        immediate: true,
        handler(newScatterPoints) {
          console.log('New scattered points : ', newScatterPoints, '\n');

          // update chart visualization with new scatter points
          this.chartOptions.series[0].data = newScatterPoints;

        }
      },

      regressionPoints: {
        immediate: true,
        handler(newRegressionPoints) {
          console.log('New regression points :', newRegressionPoints, '\n');

          // update chart options

          // if there exists a regression line => update it
          if (this.chartOptions.series.length > 1) {

            // remove current one
            this.chartOptions.series.splice(1, 1);

            // add new one
            this.chartOptions.series.push({
              name: 'line',
              type: 'line',
              showSymbol: false,
              smooth: true,
              markPoint: {
                itemStyle: {
                  normal: {
                    color: 'transparent'
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: 'left',
                    textStyle: {
                      color: '#333',
                      fontSize: 14
                    }
                  }
                },
              },
              data: this.regressionPoints,
            });

          }

          // if there is no regression line => add it for the first time
          else {
            this.chartOptions.series.push({
              name: 'line',
              type: 'line',
              showSymbol: false,
              smooth: true,
              markPoint: {
                itemStyle: {
                  normal: {
                    color: 'transparent'
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: 'left',
                    textStyle: {
                      color: '#333',
                      fontSize: 14
                    }
                  }
                },
              },
              data: this.regressionPoints,
            });
          }
        }
      }

    },
    methods: {
      // Handlers

      handleChartClick: function (event) {

        console.log(`Clicked event : `, event);

        // remove this point from both x and y
        let index = event.dataIndex;

        this.x.splice(index, 1);
        this.y.splice(index, 1);
      }
    }
  }
</script>

<style lang="scss">
  .test {
    color: red;
  }
</style>

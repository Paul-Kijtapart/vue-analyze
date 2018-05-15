<template>
  <div class="serie-to-serie-analysis">

    <!-- Chart display -->
    <chart ref="chart"
           :options="chartOptions"
           :auto-resize="true"
           @click="handleChartClick"
           class="serie-to-serie-analysis__chart">
    </chart>

  </div>
</template>

<script>

  // libraries
  import SimpleLinearRegression from 'ml-regression-simple-linear';

  // models
  import {
    TimeSeriesManager,
    TimeSeries
  } from "../models/index";

  export default {
    name: "serie-to-serie-analysis",
    props: {

      // initial data
      baseSerie: {
        type: TimeSeries,
        required: true
      },

      driverSerie: {
        type: TimeSeries,
        required: true
      }

    },
    data: function () {

      // create time serie manage to analyze multiple time series
      let timeserieManager = new TimeSeriesManager();

      timeserieManager.add(this.driverSerie);
      timeserieManager.add(this.baseSerie);

      return {

        // copy of the passed-in data
        timeserieManager: timeserieManager,

        // data to display graph
        scatterPoints: [],

        chartOptions: {
          title: {
            text: "Series to Series"
          },
          xAxis: [
            {
              name: this.baseSerie.name,
              nameLocation: "middle"
            }
          ],
          yAxis: [
            {
              name: this.driverSerie.name,
              nameLocation: "middle"
            }
          ],
          series: [{
            symbolSize: 20,
            data: [],
            type: 'scatter'
          }]
        }
      };
    },
    computed: {

      x: function () {
        let vals = [];

        this.scatterPoints.forEach(point => {
          vals.push(point[0]);
        });

        return vals;
      },

      y: function () {
        let vals = [];

        this.scatterPoints.forEach(point => {
          vals.push(point[1]);
        });

        return vals;
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

      timeserieManager: {
        immediate: true,
        deep: true,
        handler(newTimeserieManager) {
          console.log("New timeserieManager : ", newTimeserieManager);

          this.scatterPoints = newTimeserieManager.getScatterPoints();
        }
      },

      scatterPoints: {
        immediate: true,
        handler(newScatterPoints) {
          console.log('New scattered points : ', newScatterPoints, '\n');

          // update series
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
        let point = event.data;

        let timestamp = point[2];

        this.timeserieManager.removePointWithTimestamp(timestamp);
      }
    }
  }
</script>

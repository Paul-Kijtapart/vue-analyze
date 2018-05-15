<template>
  <div class="timestamp-to-serie-analysis">

    <!-- Chart display -->
    <chart ref="chart"
           :options="chartOptions"
           :auto-resize="true"
           class="timestamp-to-serie-analysis__chart">
    </chart>

  </div>
</template>

<script>

  // models
  import {
    TimeSeries,
    TimeSeriesManager
  } from "../models";

  export default {
    name: "timestamp-to-serie-analysis",
    props: {
      baseSerie: {
        type: TimeSeries,
        required: true
      },

      driverSeries: {
        type: TimeSeriesManager,
        required: false,
        default: new TimeSeriesManager()
      }

    },
    data: function () {
      return {

        baseAxis: {
          name: this.baseSerie.name,
          data: this.baseSerie.getTimestamps(),
          nameLocation: 'middle'
        }
      };
    },
    computed: {
      chartOptions: function () {

        let vm = this;

        let chartOptions = {
          title: {
            text: "Series to Timestamp"
          },
          xAxis: [],
          yAxis: [],
          series: [],
          grid: {
            left: 65,
            right: 65
          }
        };

        // load data to chart option
        chartOptions.xAxis.push(this.baseAxis);

        this.driverSeries.timeSeriesList.forEach((timeserie, index) => {

          chartOptions.yAxis.push({
            ...timeserie.getEchartAxis(),

            // gridIndex: index, // axis mapping (don't add this)
            nameLocation: 'middle',
            nameGap: 42


          });
          chartOptions.series.push({
            ...timeserie.getEchartSerie(),

            xAxisIndex: 0,
            yAxisIndex: index // axis mapping

          });

        });

        return chartOptions;
      }
    }
  }
</script>

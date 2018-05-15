<template>
  <div class="data-analysis">

    <div class="data-analysis__head">

    </div>

    <div class="data-analysis__body">

      <!-- timestamp to serie -->
      <div class="timestamp-to-serie-wrapper">

        <timestamp-to-serie-analysis :baseSerie="baseSerie"
                                     :driverSeries="driverSeries">
        </timestamp-to-serie-analysis>

      </div>

      <!-- serie to serie display -->
      <div class="serie-to-serie-list">

        <div v-for="driverSerie in driverSeries.timeSeriesList"
             :key="driverSerie.id"
             class="serie-to-serie-item">

          <serie-to-serie :baseSerie="baseSerie"
                          :driverSerie="driverSerie">
          </serie-to-serie>

        </div>
      </div>

    </div>

  </div>
</template>

<script>

  // models
  import {
    TimeSeriesManager,
    TimeSeries
  } from "../models/index";
  import SerieToSerie from "./serie-to-serie";
  import TimestampToSerieAnalysis from "./timestamp-to-serie";

  export default {
    name: "data-analysis",
    components: {
      TimestampToSerieAnalysis,
      SerieToSerie
    },
    props: {

      // initial data
      initialBaseline: {
        type: Object,
        required: true,
      },

      initialDrivers: {
        type: Array,
        required: false,
        default: function () {
          return [];
        }
      }

    },
    data: function () {

      // create time serie manage to analyze multiple time series
      let timeserieManager = new TimeSeriesManager();

      this.initialDrivers.forEach(driverOption => {
        timeserieManager.add(TimeSeries.buildFromDTO(driverOption));
      });


      return {

        // copy of the passed-in data
        baseSerie: TimeSeries.buildFromDTO(this.initialBaseline),

        driverSeries: timeserieManager

      };
    }
  }
</script>


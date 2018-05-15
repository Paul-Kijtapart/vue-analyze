<template>
  <div class="timestamp-to-serie-analysis">

  </div>
</template>

<script>
  import {
    TimeSeries
  } from "../models";

  export default {
    name: "timestamp-to-serie-analysis",
    props: {
      baseSerie: {
        type: TimeSeries,
        required: true
      }
    }
  }
</script>

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false;

// Register Echarts
import ECharts from 'vue-echarts/components/ECharts';

// import ECharts modules manually to reduce bundle size
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'

import 'echarts/lib/component/tooltip';

// register component to use
Vue.component('chart', ECharts);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {App},
  template: '<App/>'
});

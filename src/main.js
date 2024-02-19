import './assets/vendor/normalize/normalize.css';

import Vue from 'vue'
import App from './App.vue'

//import { library } from '@fortawesome/fontawesome-svg-core'
//import { faMale} from '@fortawesome/free-solid-svg-icons'
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//
//library.add(faMale)

Vue.config.productionTip = false

import LessonHeader from './components/LessonHeader.vue'
import Navigation from './components/Navigation.vue'

import Slider from './components/ui/Slider.vue'
import StackedBar from './components/ui/StackedBar.vue'
import MultiBars from './components/graph/MultiBars.vue'
import Hlines from './components/graph/Hlines.vue'
import Vlines from './components/graph/Vlines.vue'
import Xaxis from './components/graph/Xaxis.vue'
import XTitle from './components/graph/XTitle.vue'
import YLabels from './components/graph/YLabels.vue'
import XLabels from './components/graph/XLabels.vue'
import YTitle from './components/graph/YTitle.vue'
import Yaxis from './components/graph/Yaxis.vue'
import Graph from './components/graph/Graph.vue'
import VBars from './components/graph/VBars.vue'
import HBars from './components/graph/HBars.vue'
import GLegend from './components/graph/GLegend.vue'
import GTitle from './components/graph/GTitle.vue'

//Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.component('LessonHeader', LessonHeader);
Vue.component('Navigation', Navigation);
Vue.component('Slider', Slider);
Vue.component('StackedBar', StackedBar);
Vue.component('MultiBars', MultiBars);
Vue.component('Hlines', Hlines);
Vue.component('Vlines', Vlines);
Vue.component('Xaxis', Xaxis);
Vue.component('Xaxis', Xaxis);
Vue.component('XTitle', XTitle);
Vue.component('YLabels', YLabels);
Vue.component('XLabels', XLabels);
Vue.component('YTitle', YTitle);
Vue.component('Yaxis', Yaxis);
Vue.component('Graph', Graph);
Vue.component('VBars', VBars);
Vue.component('HBars', HBars);
Vue.component('GLegend', GLegend);
Vue.component('GTitle', GTitle);

new Vue({
  render: h => h(App),
}).$mount('#app')

Vue.nextTick(function() {
  window.console.log("updating dom");
})

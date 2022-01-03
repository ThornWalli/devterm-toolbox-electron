
import Vue from 'vue';
import App from '@/components/App.vue';
// import App from '@/App.vue';

// plugins
import './plugins/error';
import './plugins/config';
import './plugins/server';
import './plugins/client';

Vue.component('App', App);

new Vue({
  render: (h) => h(App)
}).$mount('#app');

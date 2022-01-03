
import Vue from 'vue';
import errorList from './error';
import Client from '@/../classes/Client';

const client = Vue.observable(new Client());
client.on('error', (error) => {
  errorList.add(error);
});

Object.defineProperty(Vue.prototype, '$client', {
  get () {
    return client;
  }
});

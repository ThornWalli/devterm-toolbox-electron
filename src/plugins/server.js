
import Vue from 'vue';
import { ipcRenderer } from 'electron';

class ServerControl {
  constructor () {
    this.options = {
      active: false,
      hosts: [],
      port: null,
      activeSessions: 0
    };
  }

  async start (port) {
    await ipcRenderer.invoke('server:start', port);
    await this.refresh();
  }

  async stop () {
    await ipcRenderer.invoke('server:stop');
    await this.refresh();
  }

  async refresh () {
    serverControl.options = await ipcRenderer.invoke('server:getOptions');
    console.log('serverControl.options', serverControl.options);
  }
}

const serverControl = Vue.observable(new ServerControl());

Object.defineProperty(Vue.prototype, '$server', {
  get () {
    return serverControl;
  }
});

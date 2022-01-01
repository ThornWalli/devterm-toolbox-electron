
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
    const result = await ipcRenderer.invoke('startServer', port);
    if (result instanceof Error) {
      throw result;
    } else {
      await this.refresh();
    }
  }

  async stop () {
    await ipcRenderer.invoke('stopServer');
    await this.refresh();
  }

  async refresh () {
    serverControl.options = await ipcRenderer.invoke('getServerOptions');
    console.log('serverControl.options', serverControl.options);
  }
}

const serverControl = Vue.observable(new ServerControl());

Object.defineProperty(Vue.prototype, '$server', {
  get () {
    return serverControl;
  }
});

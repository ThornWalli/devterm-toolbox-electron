
import Vue from 'vue';

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
    const result = await window.electron.ipcRenderer.invoke('startServer', port);
    if (result instanceof Error) {
      throw result;
    } else {
      await this.refresh();
    }
  }

  async stop () {
    await window.electron.ipcRenderer.invoke('stopServer');
    await this.refresh();
  }

  async refresh () {
    serverControl.options = await window.electron.ipcRenderer.invoke('getServerOptions');
  }
}

const serverControl = Vue.observable(new ServerControl());

Object.defineProperty(Vue.prototype, '$server', {
  get () {
    return serverControl;
  }
});

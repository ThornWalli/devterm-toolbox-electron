import { getDefaultConfig } from '@/../utils/config.js';

export default class Config {
  constructor () {
    this.data = getDefaultConfig();
    this.version = null;
  }

  async init () {
    this.version = await window.electron.ipcRenderer.invoke('getCurrentVersion');
  }

  toJSON () {
    return Object.assign({}, this.data, { version: this.version });
  }

  get (name) {
    return this.data[name];
  }

  set (name, value) {
    if (typeof name === 'string') {
      this.data[name] = value;
    } else if (typeof name === 'object') {
      Object.entries(name).forEach(([name, value]) => this.set(name, value));
    }
  }

  save () {
    console.log(this.toJSON());
    return window.electron.ipcRenderer.invoke('saveConfig', this.toJSON());
  }

  async load () {
    return (this.data = Object.assign(getDefaultConfig(), await window.electron.ipcRenderer.invoke('loadConfig')));
  }
};

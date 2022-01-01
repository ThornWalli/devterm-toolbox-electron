
import { ipcRenderer, remote } from 'electron';

export default class Config {
  constructor () {
    this.data = getDefaultConfig();
  }

  toJSON () {
    const version = remote.app.getVersion();
    return Object.assign({}, this.data, { version });
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
    return ipcRenderer.invoke('saveConfig', this.toJSON());
  }

  async load () {
    return (this.data = Object.assign(getDefaultConfig(), await ipcRenderer.invoke('loadConfig')));
  }
}

export const getDefaultConfig = () => {
  return {
    theme: 'amber',
    host: null,
    port: null,
    startType: null
  };
};


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
    if (typeof name === 'string'){
    this.data[name] = value;
  } else   if (typeof name === 'object'){ {

  }
  }

  save () {
    console.log(this.toJSON());
    return ipcRenderer.invoke('config:save', this.toJSON());
  }

}

export const getDefaultConfig = () => {
  return {
    host: null,
    port: null,
    remember: false
  };
};

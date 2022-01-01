import EventEmitter from 'events';
import { io } from 'socket.io-client';

export default class Client extends EventEmitter {
  constructor () {
    super();
    this.socket = null;
    this.connected = false;
  }

  async connect (port = 3000, host = 'localhost', secure = false) {
    const protocol = secure ? 'wss' : 'ws';
    const socket = io(`${protocol}://${host}:${port}`, {
      // reconnectionDelayMax: 10000,
      autoConnect: false,
      reconnection: false,
      secure
    });
    this.socket = await new Promise(resolve => {
      socket.on('connect_error', (error) => {
        this.emit('error', error);
      });
      socket.on('connect', () => {
        this.connected = socket.connected;
        resolve(socket);
      });
      socket.on('disconnect', () => {
        this.emit('disconnect');
        this.disconnect();
      });
      socket.connect();
    });
    this.emit('connect');
  }

  get host () {
    return this.socket?.io?.opts?.hostname;
  }

  get port () {
    return (this.socket?.io?.opts?.port && Number(this.socket?.io?.opts?.port)) || undefined;
  }

  get secure () {
    return this.socket?.io?.opts?.secure;
  }

  disconnect () {
    this.socket.disconnect();
    this.socket = null;
    this.connected = false;
  }

  async executeActions (actions) {
    const value = await this.socket.pemit('executeActions', actions);
    console.log('executeActions', value);
  }

  async getTemperatures () {
    const value = await this.socket.pemit('getTemperatures');
    console.log('getTemperatures', value);
  }

  async getDevTermType () {
    const value = await this.socket.pemit('getDevTermType');
    console.log('getDevTermType', value);
  }

  async getBattery () {
    const value = await this.socket.pemit('getBattery');
    console.log('getBattery', value);
  }
}

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

  promiseEmit (name, value) {
    return new Promise(resolve => {
      this.socket.emit(name, value, resolve);
    });
  }

  disconnect () {
    this.socket.disconnect();
    this.socket = null;
    this.connected = false;
  }

  async getInfo () {
    const value = await this.promiseEmit('getInfo');
    console.log('getInfo', value);
    return value;
  }

  async executeActions (actions) {
    const value = await this.promiseEmit('executeActions', actions);
    console.log('executeActions', value);
  }
}

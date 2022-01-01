import { io } from 'socket.io-client';

const port = process.env.DEVTERM_TOOLBOX_PORT || 3000;

export default class Client {
  constructor () {
    this.socket = null;
  }

  connect () {
    this.socket = io(`ws://localhost:${port}`, {
      reconnectionDelayMax: 10000,
      origin: false
    });
    console.log('socket', this.socket);
  }

  disconnect () {
    this.socket.disconnect();
  }

  async executeActions (actions) {
    const value = await this.socket.pemit('executeActions', actions);
    console.log('executeActions', value);
  }

  async getInfo () {
    const value = await this.socket.pemit('getInfo');
    console.log('getInfo', value);
  }
}

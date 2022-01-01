
import http from 'http';
import { createPrinter } from 'node-devterm/index.js';
import { Server as SocketIoServer } from 'socket.io';
import { getNetworkAddresses } from '../utils/network';
import { ACTION_DEFINITIONS } from '../utils/action';

const DEFAULT_PORT = (process.env.DEVTERM_TOOLBOX_PORT || 3000);
export default class Server {
  constructor () {
    this.port = DEFAULT_PORT;
    this.active = false;
    this.sockets = new Map();
    this.server = http.createServer();
    this.printer = createPrinter();
    this.printer.debug = true;
  }

  get hosts () {
    return getNetworkAddresses();
  }

  start (port) {
    return new Promise((resolve, reject) => {
      this.port = port || this.port;
      this.io = new SocketIoServer(this.server);
      this.server.listen(port, async () => {
        try {
          await this.printer.connect();
          this.active = true;
          console.info(`listening on \`*:${port}\``);
          this.io.on('connection', this.onIoConnection.bind(this));
          resolve();
        } catch (error) {
          this.io.emit('error', error);
          reject(error);
        }
      });
    });
  }

  async stop () {
    console.log('server stop');
    await new Promise(resolve => this.io.close(resolve));
    await new Promise(resolve => { this.server.close(resolve); });
    this.active = false;
    this.sockets = new Map();
  }

  registerEvents (socket) {
    socket.on('executeActions', onSocketExecuteActions);
    socket.on('getInfo', onSocketGetInfo);
    // #####
    socket.on('disconnect', () => {
      this.sockets.delete(socket.id);
      console.log('user disconnected');
    });
  }

  onIoConnection = (socket) => {
    this.sockets.set(socket.id, socket);
    console.info(`a user connected \`${socket.id}\``);
    this.registerEvents(socket);
  }
};

const onSocketExecuteActions = (actions) => {
  // prepare actions
  const preparedActions = actions.map(action => {
    if ('printerCommand' in ACTION_DEFINITIONS[action.type]) {
      return (printer) => ACTION_DEFINITIONS[action.type].printerCommand(printer, action.value);
    }
    console.warn(`no printer command found for \`${action.type}\``);
    return null;
  }).filter(Boolean);

  preparedActions.forEach(command => command(this.printer));
  console.info(`execute ${preparedActions.length} actions…`);
  return true;
};

const onSocketGetInfo = (value, reply) => {
  reply({
    printerTemperature: 0,
    temperatures: [0, 0, 0, 0],
    type: 'AXX',
    battery: 100
  });
};

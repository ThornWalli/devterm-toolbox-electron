import http from 'http';
import fs from 'fs';
import { Server as SocketIoServer } from 'socket.io';
import { SERIAL_PORT_IN } from 'node-devterm/utils/devterm';
import { createPrinter } from 'node-devterm';
import { getNetworkAddresses } from '../utils/network';
import { ACTION_DEFINITIONS } from '../utils/action';

export const hasPrinterSerialPort = async () => {
  try {
    await fs.promises.access(SERIAL_PORT_IN, fs.F_OK);
  } catch (error) {
    return false;
  }
};

const DEFAULT_PORT = (process.env.DEVTERM_TOOLBOX_PORT || 3000);
export default class Server {
  constructor () {
    this.disabled = false;
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

  checkBefore

  start (port) {
    return new Promise((resolve, reject) => {
      this.port = port || this.port;
      this.io = new SocketIoServer(this.server);
      this.server.listen(port, async () => {
        try {
          this.disabled = !await hasPrinterSerialPort();
          if (this.disabled) {
            console.log('Printer not found, serivce is disabled!');
          }
          !this.disabled && await this.printer.connect();
          this.active = true;
          console.log(`listening on \`*:${port}\``);
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
    socket.on('executeActions', onSocketExecuteActions(this.printer));
    socket.on('getInfo', onSocketGetInfo);
    // #####
    socket.on('disconnect', () => {
      this.sockets.delete(socket.id);
      console.log('user disconnected');
    });
  }

  onIoConnection = (socket) => {
    this.sockets.set(socket.id, socket);
    console.log(`a user connected \`${socket.id}\``);
    this.registerEvents(socket);
  }
};

const onSocketExecuteActions = printer => (actions) => {
  // prepare actions
  const preparedActions = actions.map(action => {
    if ('printerCommand' in ACTION_DEFINITIONS[action.type]) {
      return (printer) => ACTION_DEFINITIONS[action.type].printerCommand(printer, action.value);
    }
    console.warn(`no printer command found for \`${action.type}\``);
    return null;
  }).filter(Boolean);

  if (this.disabled) {
    console.log('Printer not found, serivce is disabled!');
  } else {
    preparedActions.forEach(command => command(printer));
  }
  console.log(`execute ${preparedActions.length} actions…`);
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

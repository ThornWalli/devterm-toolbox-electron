const http = require('http');
const fs = require('fs');
const { Server: SocketIoServer } = require('socket.io');
const { SERIAL_PORT_IN } = require('node-devterm/utils/devterm');

const { createPrinter, getThermalPrinterTemperature, getTemperatures, isDevTermA06, getBattery } = require('node-devterm');
const { getNetworkAddresses } = require('../main/utils/network');
const { ACTION_PRINTER_COMMANDS } = require('../main/utils/action');

const hasPrinterSerialPort = async () => {
  try {
    await fs.promises.access(SERIAL_PORT_IN, fs.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const DEFAULT_PORT = (process.env.DEVTERM_TOOLBOX_PORT || 3000);
class Server {
  constructor () {
    this.disabled = false;
    this.port = DEFAULT_PORT;
    this.active = false;
    this.sockets = new Map();
    this.server = http.createServer();
    this.printer = createPrinter();
    this.printer.debug = true;
    this.io = new SocketIoServer(this.server);
    this.io.on('connection', this.onIoConnection.bind(this));
  }

  get hosts () {
    return getNetworkAddresses();
  }

  checkBefore

  start (port) {
    return new Promise((resolve, reject) => {
      this.port = port || this.port;
      this.server.listen(port, async () => {
        try {
          this.disabled = !await hasPrinterSerialPort();
          if (this.disabled) {
            console.log('Printer not found, serivce is disabled!');
          }
          !this.disabled && await this.printer.connect();
          this.active = true;
          console.log(`listening on \`*:${port}\``);
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
    await new Promise(resolve => (this.io && this.io.close(resolve)) || resolve());
    this.active = false;
    this.sockets = new Map();
  }

  registerEvents (socket) {
    socket.on('executeActions', onSocketExecuteActions(this.printer, this.disabled));
    socket.on('getInfo', onSocketGetInfo);
    // #####
    socket.on('disconnect', (a) => {
      this.sockets.delete(socket.id);
      console.log('user disconnected', a);
    });
  }

  onIoConnection = (socket) => {
    this.sockets.set(socket.id, socket);
    console.log(`a user connected \`${socket.id}\``);
    this.registerEvents(socket);
  }
};

const onSocketExecuteActions = (printer, disabled) => async (actions) => {
  // prepare actions
  const preparedActions = actions.map(action => {
    if (action.type in ACTION_PRINTER_COMMANDS) {
      return (printer) => ACTION_PRINTER_COMMANDS[action.type](printer, action.value);
    }
    console.warn(`no printer command found for \`${action.type}\``);
    return null;
  }).filter(Boolean);

  if (disabled) {
    console.log('Printer not found, serivce is disabled!');

    console.log(actions.find(action => action.type === 'image'));
  } else {
    await preparedActions.reduce((result, command) => result.then(() => command(printer)), Promise.resolve());
  }
  console.log(`execute ${preparedActions.length} actions…`);
  return true;
};

const onSocketGetInfo = async (value, reply) => {
  reply({
    printerTemperature: await getThermalPrinterTemperature(),
    temperatures: await getTemperatures(),
    type: await isDevTermA06() ? 'A06' : '',
    battery: await getBattery()
  });
};

module.exports = {
  default: Server,
  createPrinter,
  hasPrinterSerialPort
};

const http = require('http');
let consola = require('consola');
const { Server: SocketIoServer } = require('socket.io');
const { getNetworkAddresses } = require('../utils/network');

consola = consola.withTag('devterm-toolbox-server');

const DEFAULT_PORT = (process.env.DEVTERM_TOOLBOX_PORT || 3000);
module.exports = class Server {
  constructor () {
    this.port = DEFAULT_PORT;
    this.active = false;
    this.sockets = new Map();
    this.server = http.createServer();
  }

  get hosts () {
    return getNetworkAddresses();
  }

  start (port) {
    return new Promise(resolve => {
      this.port = port || this.port;
      this.io = new SocketIoServer(this.server);
      this.server.listen(port, (data) => {
        this.active = true;
        consola.info(`listening on \`*:${port}\``);
        this.io.on('connection', this.onIoConnection.bind(this));
        resolve();
      });
    });
  }

  async stop () {
    console.log('server stop');
    // this.io.emit('disconnect');
    await new Promise(resolve => this.io.close(resolve));
    await new Promise(resolve => this.server.close(resolve));
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
    consola.info(`a user connected \`${socket.id}\``);
    this.registerEvents(socket);
  }
};

const onSocketExecuteActions = () => {
  return true;
};

const onSocketGetInfo = () => {
  return {
    printerTemperature: 0,
    temperatures: [0, 0, 0, 0],
    type: 'AXX',
    battery: 50
  };
};

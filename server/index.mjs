
import Server from '../src/classes/Server.js';

const run = () => {
  const server = new Server();

  server.start(3000);
};

run();
// const http = require('http');
// let consola = require('consola');
// const { Server } = require('socket.io');
// const users = new Map();

// consola = consola.withTag('devterm-toolbox-server');

// const run = () => {
//   const server = http.createServer((req) => {
//     console.log('test');
//   });
//   const io = new Server(server);

//   io.on('connection', onIoConnection);

//   const port = process.env.DEVTERM_TOOLBOX_PORT || 3000;

//   server.listen(port, (data) => {
//     consola.info(`listening on \`*:${port}\``);
//   });
// };

// const onIoConnection = (socket) => {
//   users.set(socket.id, socket);
//   consola.info(`a user connected \`${socket.id}\``);
//   registerEvents(socket);
// };

// const registerEvents = (socket) => {
//   socket.on('executeActions', onSocketExecuteActions);
//   socket.on('getInfo', onSocketGetInfo);
//   // #####
//   socket.on('disconnect', () => {
//     users.delete(socket.id);
//     console.log('user disconnected');
//   });
// };

// const onSocketExecuteActions = () => {
//   return true;
// };

// const onSocketGetInfo = () => {
//   return {
//     printerTemperature: 0,
//     temperatures: [0, 0, 0, 0],
//     type: 'AXX',
//     battery: 50
//   };
// };

// run();

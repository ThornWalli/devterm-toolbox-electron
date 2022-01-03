
const fs = require('fs');
const { resolve } = require('path');
const { app } = require('electron');
const esmRequire = require('esm')(module);
const { getDefaultConfig } = esmRequire('../utils/config');

const ipc = (server) => {
  const { ipcMain } = require('electron');

  ipcMain.handle('startServer', async (event, port) => {
    try {
      return await server.start(port);
    } catch (error) {
      server.stop();
      return error;
    }
  });

  ipcMain.handle('getCurrentVersion', (event) => {
    return app.getVersion();
  });
  ipcMain.handle('stopServer', (event) => {
    return server.stop();
  });
  ipcMain.handle('getServerOptions', (event) => {
    return getServerOptions(server);
  });

  const userDataPath = app.getPath('userData');
  const configFile = resolve(userDataPath, 'config.json');
  console.log('configFile', configFile);
  ipcMain.handle('loadConfig', async (event) => {
    try {
      return JSON.parse(await fs.promises.readFile(configFile, 'utf-8'));
    } catch (error) {
      return getDefaultConfig();
    }
  });

  ipcMain.handle('saveConfig', (event, data) => {
    fs.promises.writeFile(configFile, JSON.stringify(data), 'utf-8');
  });
};

const getServerOptions = (server) => {
  return {
    active: server.active,
    port: server.port,
    hosts: server.hosts,
    activeSessions: server.sockets.size
  };
};

module.exports = { default: ipc };

import { resolve, join } from 'path';
import url from 'url';
import fs from 'fs';
// eslint-disable-next-line no-unused-vars
import { app, BrowserWindow, Menu } from 'electron';
import pkg from '../../package.json';
import Server from '../classes/Server';
import { getDefaultConfig } from '../classes/Config';
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  if (pkg.version) {
    app.setVersion(pkg.version);
  }
  if (pkg.productName) {
    app.setName(pkg.productName);
  } else if (pkg.name) {
    app.setName(pkg.name);
  }
  app.setPath('userData', join(app.getPath('appData'), app.getName()));
  app.setPath('userCache', join(app.getPath('cache'), app.getName()));
  app.setAppPath(resolve('../../'));
}

const server = new Server();

// eslint-disable-next-line no-unused-vars
const isMac = process.platform === 'darwin';

let mainWindow;
process.env.VERSION = pkg.version;

function createMainWindow () {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      fullscreen: true,
      webSecurity: false
    },
    title: pkg.productName,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: true,
    width: 1280,
    height: 480
  });

  // if (isMac) {
  //   window.setWindowButtonVisibility(false);
  // }

  if (isDev) {
    window.webContents.openDevTools();
  }

  if (isDev) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(url.format({
      pathname: join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
  }

  window.on('closed', () => {
    server && server.close();
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});

// const isMac = process.platform === 'darwin'; ;

// const template = [
//   // { role: 'appMenu' }
//   ...(isMac
//     ? [{
//         label: pkg.name,
//         submenu: [
//           { role: 'about' },
//           { type: 'separator' },
//           // { role: 'services' },
//           // { type: 'separator' },
//           // { role: 'hide' },
//           // { role: 'hideOthers' },
//           // { role: 'unhide' },
//           { role: 'reload' },
//           { role: 'forceReload' },
//           { role: 'toggleDevTools' },
//           { role: 'togglefullscreen' },
//           { type: 'separator' },
//           { role: 'quit' }
//         ]
//       }]
//     : []), {
//     label: 'Edit',
//     submenu: [
//       { role: 'undo' },
//       { role: 'redo' },
//       { type: 'separator' },
//       { role: 'cut' },
//       { role: 'copy' },
//       { role: 'paste' },
//       ...(isMac
//         ? [
//             { role: 'pasteAndMatchStyle' },
//             { role: 'delete' },
//             { role: 'selectAll' },
//             { type: 'separator' },
//             {
//               label: 'Speech',
//               submenu: [
//                 { role: 'startSpeaking' },
//                 { role: 'stopSpeaking' }
//               ]
//             }
//           ]
//         : [
//             { role: 'delete' },
//             { type: 'separator' },
//             { role: 'selectAll' }
//           ])
//     ]
//   }
//   // {
//   //   role: 'help',
//   //   submenu: [
//   //     {
//   //       label: 'Learn More',
//   //       click: async () => {
//   //         const { shell } = require('electron');
//   //         await shell.openExternal('https://electronjs.org');
//   //       }
//   //     }
//   //   ]
//   // }
// ];

// const menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(menu);

const { ipcMain } = require('electron');

ipcMain.handle('server:start', (event, port) => {
  return server.start(port);
});
ipcMain.handle('server:stop', (event) => {
  return server.stop();
});
ipcMain.handle('server:getOptions', (event) => {
  return getServerOptions(server);
});

const userDataPath = app.getPath('userData');
const configFile = resolve(userDataPath, 'config.json');

ipcMain.handle('config:load', async (event) => {
  try {
    return JSON.parse(await fs.promises.readFile(configFile, 'utf-8'));
  } catch (error) {
    return getDefaultConfig();
  }
});

ipcMain.handle('config:save', (event, data) => {
  fs.promises.writeFile(configFile, JSON.stringify(data), 'utf-8');
});

const getServerOptions = (server) => {
  return {
    active: server.active,
    port: server.port,
    hosts: server.hosts,
    activeSessions: server.sockets.size
  };
};

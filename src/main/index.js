import { resolve, join } from 'path';
import url from 'url';
// eslint-disable-next-line no-unused-vars
import { app, BrowserWindow } from 'electron';
import pkg from '../../package.json';
import Server from '../classes/Server';
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  if (pkg.version) {
    app.setVersion(pkg.version);
  }
  if (pkg.productName) {
    app.name = pkg.productName;
  } else if (pkg.name) {
    app.name = pkg.name;
  }
  app.setPath('userData', join(app.getPath('appData'), app.name));
  app.setPath('userCache', join(app.getPath('cache'), app.name));
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
      webSecurity: false,
      contextIsolation: false
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
    server && server.stop();
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

// require('./menu')(server);
require('./ipc').default(server);

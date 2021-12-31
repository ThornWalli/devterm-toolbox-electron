import * as path from 'path';
import { format as formatUrl } from 'url';
// eslint-disable-next-line no-unused-vars
import { app, BrowserWindow, Menu } from 'electron';
import pkg from '../../package.json';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

process.env.VERSION = pkg.version;

function createMainWindow () {
  const window = new BrowserWindow({
    webPreferences: { nodeIntegration: true, fullscreen: true },
    title: pkg.productName,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    width: 1280,
    height: 480
  });

  if (process.platform === 'darwin') {
    window.setWindowButtonVisibility(false);
  }

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
  }

  window.on('closed', () => {
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

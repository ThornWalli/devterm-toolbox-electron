
// import { app, Menu } from 'electron';
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

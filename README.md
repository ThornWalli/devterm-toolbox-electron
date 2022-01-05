# devterm-toolbox-electron

Electron App for printing with DevTerm thermal printer via `/tmp/DEVTERM_PRINTER_IN`.

## Usage

**Important:** On the DevTerm and further systems the appropriate libraries for `node-canvas` must be installed.

https://github.com/Automattic/node-canvas#compiling 


```bash
# install
npm i 

# dev 
npm run dev

# build
npm run build:win # uses windows as build target
npm run build:mac # uses mac as build target
npm run build:linux # uses linux as build target
```

Optional configuration options can be found in the [Electron Builder CLI docs](https://www.electron.build/cli.html).

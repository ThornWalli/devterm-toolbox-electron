
<template>
  <div class="app" :style="style" :class="{'loading': loading}">
    <app-menu class="header">
      <app-menu-item :selected="currentView === 'log'" disabled>
        Log
      </app-menu-item>
      <app-menu-item :selected="currentView === 'info'" disabled>
        Info
      </app-menu-item>
      <app-menu-item :selected="currentView === VIEWS.PRINTER" @click="currentView = VIEWS.PRINTER">
        Printer
      </app-menu-item>
      <app-menu-spacer><button class="header-drag" /></app-menu-spacer>
      <app-menu-item disabled @click="onClickSave">
        Save
      </app-menu-item>
      <app-menu-item disabled @click="onClickLoad">
        Load
      </app-menu-item>
      <app-menu-item disabled @click="onClickOptions">
        Options
      </app-menu-item>
      <app-menu-item @click="onClickClose">
        Close
      </app-menu-item>
    </app-menu>
    <div class="content">
      <view-start v-if="!$client.connected" @apply="onApplyViewStart" />
      <view-printer v-else-if="currentView === VIEWS.PRINTER" :colors="colors" />
    </div>
    <app-menu class="footer">
      <app-menu-item @click="onClickMinimizeWindow">
        Minimize
      </app-menu-item>
      <app-menu-item @click="onClickMaximizeWindow">
        Maximize
      </app-menu-item>
      <app-menu-item :selected="fullscreen" @click="onClickFullscreen">
        Fullscreen
      </app-menu-item>
      <app-menu-spacer />
      <app-menu-text class="connection" :class="{'connected': $server.options.active}" @click="showServerDialog">
        <span>{{ $server.options.active ? `Server Port: ${$server.options.port}` : 'Server Offline' }}</span>
      </app-menu-text>
      <app-menu-divider />
      <app-menu-text class="connection" :class="{'connected': clientConnected}" @click="showRemoteDialog">
        <span>{{ clientConnected ? `Online (${$client.host}:${$client.port})` : 'Offline' }}</span>
      </app-menu-text>
      <app-menu-divider />
      <app-menu-text class="info-version">
        {{ version }}
      </app-menu-text>
    </app-menu>
    <dialog-error v-for="(error,index) in $errorList.errors" v-bind="error" :key="index" init-open />
    <dialog-remote ref="remoteDialog" />
    <dialog-server ref="serverDialog" />
  </div>
</template>
<script>/* eslint-disable vue/no-unused-components */
import { loadFonts } from '@/utils/font';

import AppMenu from '@/components/app/Menu';
import AppMenuItem from '@/components/app/MenuItem';
import AppMenuText from '@/components/app/MenuText';
import AppMenuSpacer from '@/components/app/MenuSpacer';
import AppMenuDivider from '@/components/app/MenuDivider';
import DialogError from '@/components/dialogs/Error';
import DialogRemote from '@/components/dialogs/Remote';
import DialogServer from '@/components/dialogs/Server';

import ViewPrinter from '@/components/views/Printer';
import ViewStart from '@/components/views/Start';

const VIEWS = {
  NONE: null,
  START: 'start',
  PRINTER: 'priner'
};

export default {
  components: {
    ViewPrinter,
    ViewStart,
    AppMenu,
    AppMenuItem,
    AppMenuText,
    AppMenuSpacer,
    AppMenuDivider,
    DialogError,
    DialogRemote,
    DialogServer
  },

  data () {
    const electron = window.require('electron');
    const remote = electron.remote; // ... console.log(remote.process.env["TZ"]);
    return {
      VIEWS,

      currentView: VIEWS.PRINTER,

      colors: {
        primary: [255, 204, 0], // [51, 255, 0],
        secondary: [0, 0, 0] // [51, 255, 0]
      },
      ready: false,
      loading: false,
      fullscreen: false,
      version: remote.process.env.VERSION
    };
  },

  computed: {
    clientConnected () {
      return this.$client.connected;
    },
    style () {
      return {
        '--color-primary': `rgb(${this.colors.primary.join(',')})`,
        '--color-secondary': `rgb(${this.colors.secondary.join(',')})`,
        ...Object.fromEntries(Array(10).fill('').map((v, i) => [`--color-primary-${(i + 1) * 10}`, `rgb(${this.colors.primary.join(' ')} / ${(i + 1) * 10}%)`]))
      };
    }
  },

  async  mounted () {
    await loadFonts();
    await this.$server.refresh();
    await this.$config.load();

    if (this.$config.get('remember')) {
      const port = this.$config.get('port');
      const host = this.$config.get('host');
      if (this.$config.get('remember') === 'local' && !this.$server.options.active) {
        await this.$server.start(port);
      }
      this.$client.connect(port, host);
    }
    this.ready = true;
    // eslint-disable-next-line no-use-before-define

    // fullscreen
    const electron = require('electron');
    const window = electron.remote.getCurrentWindow();
    this.fullscreen = window.isFullScreen();
    window.addListener('enter-full-screen', () => {
      this.fullscreen = true;
    });
    window.addListener('leave-full-screen', () => {
      this.fullscreen = false;
    });
  },
  methods: {

    onClickMinimizeWindow () {
      const electron = require('electron');
      const window = electron.remote.getCurrentWindow();
      window.minimize();
    },
    onClickMaximizeWindow () {
      const electron = require('electron');
      const window = electron.remote.getCurrentWindow();
      window.maximize();
    },

    onClickFullscreen () {
      const electron = require('electron');
      const window = electron.remote.getCurrentWindow();
      window.setFullScreen(!this.fullscreen);
    },

    onClickClose () {
      const electron = require('electron');
      const window = electron.remote.getCurrentWindow();
      window.close();
    },

    onClickSave () {
      const fs = require('fs');
      const path = require('path');
      const electron = require('electron');
      const dialog = electron.remote.dialog;
      dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, '../assets/sample.txt'),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
          {
            name: 'Text Files',
            extensions: ['txt', 'docx']
          }],
        properties: []
      }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
          console.log(file.filePath.toString());

          // Creating and Writing to the sample.txt file
          fs.writeFile(file.filePath.toString(),
            'This is a Sample File', function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    onClickLoad () {},
    onClickOptions () {},

    async onApplyViewStart ({ type, remember }) {
      this.$config.set('remember', remember && type);
      await this.$config.save();
      this.$client.once('connect', async () => {
        this.$config.set('host', this.$client.host);
        this.$config.set('port', this.$client.port);
        await this.$config.save();
      });
      switch (type) {
        case 'local':
          await this.showServerDialog();
          break;
        case 'remote':
          await this.showRemoteDialog();
          break;
      }
    },
    showServerDialog () {
      return this.$refs.serverDialog.show();
    },
    showRemoteDialog () {
      return this.$refs.remoteDialog.show();
    }

  }
}; ;

</script>

<style lang="postcss" scoped>
.header-drag {
  width: 100%;
  height: 100%;
  cursor: grab;
  background: var(--color-secondary);
  border: none;
  outline: none;
  appearance: none;
  -webkit-app-region: drag;

  &:active {
    cursor: grabbing;
  }
}

.connection {
  color: red;

  &.connected {
    color: green;
  }
}

.info-version {
  font-style: italic;
}

.app {
  position: relative;
  display: flex;
  flex-direction: column;

  /* min-width: 1280px; */

  /* height: 480px; */
  width: 100%;
  height: 100%;
  font-family: monospace;
  color: var(--color-primary);

  & > .header {
    border-bottom: solid var(--color-primary) calc(2 / 16 * 1em);
  }

  & > .footer {
    border-top: solid var(--color-primary) calc(2 / 16 * 1em);
  }

  & > .header,
  & > .footer {
    height: calc(22 / 16 * 1em);
  }

  & > .content {
    position: relative;
    display: flex;
    flex-direction: column;

    & > div:first-child {
      height: 100%;

      /* height: calc(100% - ((32 + 8) / 16 * 1em) * 1); */
    }

    height: calc(100% - ((24 ) / 16 * 1em) * 2);

    /* - (4 / 16 * 1em) */
  }

  & >>> .preview {
    transition: opacity 0.2s;
  }

  &.loading {
    & >>> .preview {
      opacity: 0.6;
    }
  }
}
</style>

<style lang="postcss">
::-webkit-scrollbar {
  width: calc(10 / 16 * 1em);
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
}

::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
  outline: none;
}

:root {
  --color-background: #000;
}
::-webkit-scrollbar-corner { background: transparent; }

html,
body {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  font-size: 16px;
  background: var(--color-background);
}

strong {
  font-weight: bold;
}

hr {
  margin: calc(8 / 16 * 1em) 0;
  border-color: var(--color-primary);
  border-width: 1px 0 0;
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.5s;
}

.list-enter,
.list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.flip-list-move {
  transition: transform 0.6s;
}
</style>

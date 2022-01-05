
<template>
  <div class="app" :style="style" :class="{ready}">
    <app-menu class="header">
      <component :is="item.component" v-for="(item, index) in headerItems" :key="index" v-bind="item.props" v-on="item.on" />
    </app-menu>
    <div class="app-content">
      <view-start v-if="!$client.connected && ready" @apply="onApplyViewStart" />
      <view-printer v-else-if="currentView === VIEWS.PRINTER" v-model="printerTemplate" :colors="colors" />
      <view-info v-else-if="currentView === VIEWS.INFO" />
    </div>
    <app-menu class="footer">
      <component :is="item.component" v-for="(item, index) in footerItems" :key="index" v-bind="item.props" v-on="item.on" />
    </app-menu>
    <dialog-error v-for="(error,index) in $errorList.errors" v-bind="error" :key="index" init-open />
    <dialog-remote ref="dialogRemote" />
    <dialog-server ref="dialogServer" />
    <dialog-options ref="dialogOptions" />
  </div>
</template>
<script>
/* eslint-disable vue/no-unused-components */
import { loadFonts } from '@/utils/font';

import AppMenu from '@/components/app/Menu.vue';
import AppMenuItem from '@/components/app/MenuItem.vue';
import AppMenuText from '@/components/app/MenuText.vue';
import AppMenuSpacer from '@/components/app/MenuSpacer.vue';
import AppMenuDivider from '@/components/app/MenuDivider.vue';
import DialogError from '@/components/dialogs/Error.vue';
import DialogRemote from '@/components/dialogs/Remote.vue';
import DialogServer from '@/components/dialogs/Server.vue';
import DialogOptions from '@/components/dialogs/Options.vue';

import ViewPrinter from '@/components/views/Printer.vue';
import ViewStart from '@/components/views/Start.vue';
import ViewInfo from '@/components/views/Info.vue';

import testData from '@/data/test';
import ActionDescription from '@/classes/ActionDescription';

const VIEWS = {
  NONE: null,
  INFO: 'info',
  START: 'start',
  PRINTER: 'priner'
};

const THEMES = {
  amber: {
    primary: [255, 204, 0],
    secondary: [0, 0, 0],
    printer: {
      preview: {
        background: [255, 204, 0],
        foreground: [0, 0, 0]
      }
    }
  },
  green: {
    primary: [51, 255, 0],
    secondary: [0, 0, 0],
    printer: {
      preview: {
        background: [51, 255, 0],
        foreground: [0, 0, 0]
      }
    }
  },
  whiteBlack: {
    primary: [255, 255, 255],
    secondary: [0, 0, 0],
    printer: {
      preview: {
        background: [255, 255, 255],
        foreground: [0, 0, 0]
      }
    }
  },
  blackWhite: {
    primary: [0, 0, 0],
    secondary: [255, 255, 255],
    printer: {
      preview: {
        background: [0, 0, 0],
        foreground: [255, 255, 255]
      }
    }
  }
};

function exampleData () {
  return testData.map(data => new ActionDescription(data));
}

export default {
  components: {
    ViewPrinter,
    ViewStart,
    ViewInfo,
    AppMenu,
    AppMenuItem,
    AppMenuText,
    AppMenuSpacer,
    AppMenuDivider,
    DialogError,
    DialogRemote,
    DialogServer,
    DialogOptions
  },

  data () {
    return {
      VIEWS,

      currentView: VIEWS.PRINTER,

      ready: false,
      fullscreen: false,
      printerTemplate: exampleData()
    };
  },

  computed: {

    headerItems () {
      const printerItems = [
        {
          component: AppMenuItem,
          on: {
            click: this.onClickNew
          },
          props: { text: 'New' }
        },
        {
          component: AppMenuDivider
        },
        {
          component: AppMenuItem,
          on: {
            click: this.onClickSave
          },
          props: { text: 'Save' }
        },
        {
          component: AppMenuItem,
          title: 'Load',
          on: {
            click: this.onClickLoad
          },
          props: { text: 'Load' }
        },
        {
          component: AppMenuItem,
          on: {
            click: this.onClickOptions
          },
          props: { text: 'Options' }
        },
        {
          component: AppMenuDivider
        }
      ];

      return [
        ...((this.$client.connected && [{
          component: AppMenuItem,
          on: {
            click: () => (this.currentView = VIEWS.INFO)
          },
          props: { selected: this.currentView === VIEWS.INFO, text: 'Info' }
        },
        {
          component: AppMenuItem,
          on: {
            click: () => (this.currentView = VIEWS.PRINTER)
          },
          props: { selected: this.currentView === VIEWS.PRINTER, text: 'Printer' }
        }]) || []),
        {
          component: AppMenuSpacer
        },
        ...((this.$client.connected && this.currentView === VIEWS.PRINTER && printerItems) || []),
        {
          component: AppMenuItem,
          on: {
            click: this.onClickClose
          },
          props: { text: 'Close' }
        }

      ];
    },

    footerItems () {
      return [
        {
          component: AppMenuItem,
          on: {
            click: this.onClickMinimizeWindow
          },
          props: { text: 'Minimize' }
        },
        {
          component: AppMenuItem,
          on: {
            click: this.onClickMaximizeWindow
          },
          props: { text: 'Maximize' }
        },
        {
          component: AppMenuItem,
          on: {
            click: this.onClickFullscreen
          },
          props: { selected: this.fullscreen, text: 'Fullscreen' }
        },
        {
          component: AppMenuSpacer
        },
        {
          component: AppMenuText,
          on: {
            click: this.showServerDialog
          },
          props: { class: { connection: true, connected: this.$server.options.active }, text: `${this.$server.options.active ? `Server Port: ${this.$server.options.port}` : 'Server Offline'}` }
        },
        {
          component: AppMenuDivider
        },
        {
          component: AppMenuText,
          on: {
            click: this.showRemoteDialog
          },
          props: { class: { connection: true, connected: this.clientConnected }, text: `${this.clientConnected ? `Online (${this.$client.host}:${this.$client.port})` : 'Offline'}` }
        },
        {
          component: AppMenuDivider
        },
        {
          component: AppMenuText,
          props: { class: 'info-version', text: this.version }
        }

      ];
    },

    version () {
      return this.$config.version;
    },
    colors () {
      return THEMES[this.$config.data.theme];
    },
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
    await this.$config.init();
    await this.$server.refresh();
    await this.$config.load();

    if (this.$config.get('startType')) {
      try {
        const port = this.$config.get('port');
        const host = this.$config.get('host');
        if (this.$config.get('startType') === 'local' && !this.$server.options.active) {
          await this.$server.start(port);
        }
        if (port) {
          await this.$client.connect(port, host);
        }
      } catch (error) {
      }
    }
    this.ready = true;

    window.electron.ipcRendererReceive('window', (type, value) => {
      switch (type) {
        case 'fullscreen':
          this.fullscreen = value;
          break;
      }
    });
  },
  methods: {

    onClickMinimizeWindow () {
      window.electron.ipcRenderer.invoke('window', 'minimize');
    },
    onClickMaximizeWindow () {
      window.electron.ipcRenderer.invoke('window', 'maximize');
    },

    onClickFullscreen () {
      window.electron.ipcRenderer.invoke('window', 'fullscreen', !this.fullscreen);
    },

    onClickClose () {
      window.electron.ipcRenderer.invoke('close');
    },

    onClickNew () {
      this.printerTemplate = [];
    },

    onClickSave () {
      return window.electron.ipcRenderer.invoke('save', this.printerTemplate);
    },
    async onClickLoad () {
      const template = await window.electron.ipcRenderer.invoke('load');
      if (template) {
        this.printerTemplate = template;
      }
    },
    onClickOptions () {
      this.showOptionsDialog();
    },

    async onApplyViewStart ({ type, remember }) {
      this.$config.set('startType', (remember && type) || '');
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
      return this.$refs.dialogServer.show();
    },
    showRemoteDialog () {
      return this.$refs.dialogRemote.show();
    },
    showOptionsDialog () {
      return this.$refs.dialogOptions.show();
    }

  }
};

</script>

<style lang="postcss" scoped>
@import "@/assets/css/transitions.pcss";

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
  user-select: none;
  background: var(--color-secondary);
  opacity: 0;
  transition: opacity 0.6s ease-in;

  &.ready {
    opacity: 1;
  }

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

  & > .app-content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - ((24 ) / 16 * 1em) * 2);
    overflow: auto;

    & > div:first-child {
      height: 100%;

      /* height: calc(100% - ((32 + 8) / 16 * 1em) * 1); */
    }

    /* - (4 / 16 * 1em) */
  }

  & >>> .preview {
    transition: opacity 0.2s;
  }
}
</style>

<style lang="postcss">
::-webkit-scrollbar {
  width: calc(10 / 16 * 1em);
}

::-webkit-scrollbar-track {
  /* empty */
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

<template>
  <div class="app" :style="style">
    <div class="head">
      <ul><li>Printer</li></ul>
    </div>
    <div class="content">
      <div class="preview">
        <div>
          <div>
            <div v-if="previewItems.length < 1" class="empty-actions">
              Add a Action!
            </div>
            <div v-for="(item, index) in previewItems" :key="index">
              <component :is="item.component" :key="JSON.stringify(item.options)" v-bind="item.props" :options="item.options" />
            </div>
          </div>
        </div>
      </div>
      <div class="actions" :class="{'action-active' : activeActionItem,'drag' : isDrag}">
        <div ref="list" class="list">
          <div
            @dragover="allowDrop"
            @drop="onDrop"
          >
            <transition-group
              :name="!isDrag ? 'flip-list' : null"
              tag="ul"
            >
              <li
                v-for="(action, index) in actions"
                :id="action.id"
                :key="`${action.id}`"
              >
                <component
                  :is="getComponentByType(action.type)"
                  :id="action.id"
                  :focus="dragTarget && dragTarget.id === action.id && action.id !== dragId"
                  :value="action.value"
                  :item-states="itemStates"
                  :data-id="action.id"
                  draggable
                  @input="updateAction(index, $event)"
                  @active="$event ? (activeActionItem = action.id) : activeActionItem = null"
                  @dragstart="onDragStart"
                >
                  <template #head>
                    <div class="action-controls">
                      <span class="index">{{ index + 1 }}</span>
                      <input-icon-button @click="onClickActionUp(index)">
                        <svg-icon-arrow-up />
                      </input-icon-button>
                      <input-icon-button @click="onClickActionDown(index)">
                        <svg-icon-arrow-down />
                      </input-icon-button>
                      <input-icon-button @click="onClickActionDelete(index)">
                        <svg-icon-trash />
                      </input-icon-button>
                    </div>
                  </template>
                </component>
              </li>
            </transition-group>
          </div>
        </div>
        <div class="add-action">
          <input-drop-down v-model="selectedAction" :options="actionTypeOptions" :label="null" />
        </div>
      </div>
      <span />
    </div>
  </div>
</template>
<script>/* eslint-disable no-unused-vars */

/* eslint-disable vue/no-unused-components */

import { fromEvent } from 'rxjs';
import { ALIGN, FONT, MAX_DENSITY } from 'node-devterm/config';
import { ActionDescription, createAction, executeActions, getActionTypeOptions, getComponentByType } from '@/utils/action';
import { loadFonts } from '@/utils/font';
import SvgIconArrowUp from '@/assets/svg/icons/arrow-up.svg?vue-template';
import SvgIconArrowDown from '@/assets/svg/icons/arrow-down.svg?vue-template';
import SvgIconTrash from '@/assets/svg/icons/trash.svg?vue-template';

import InputIconButton from '@/components/inputs/IconButton';
import InputTextButton from '@/components/inputs/TextButton';
import InputDropDown from '@/components/inputs/DropDown';

export default {
  components: {
    SvgIconArrowUp,
    SvgIconArrowDown,
    SvgIconTrash,
    InputIconButton,
    InputTextButton,
    InputDropDown
  },

  data () {
    return {
      colors: {
        primary: [255, 204, 0], // [51, 255, 0],
        secondary: [0, 0, 0] // [51, 255, 0]
      },
      getComponentByType,
      ready: false,
      itemStates: {},
      activeActionItem: null,
      selectedAction: null,
      actionTypeOptions: getActionTypeOptions(),
      actions: exampleData(),
      previewItems: [],
      isDrag: false,
      dragId: null,
      dragTarget: null
    };
  },

  computed: {
    style () {
      return {
        '--color-primary': `rgb(${this.colors.primary.join(',')})`,
        '--color-secondary': `rgb(${this.colors.secondary.join(',')})`,
        ...Object.fromEntries(Array(10).fill('').map((v, i) => [`--color-primary-${(i + 1) * 10}`, `rgb(${this.colors.primary.join(' ')} / ${(i + 1) * 10}%)`]))
      };
    }
  },

  watch: {
    actions: {
      handler (value) {
        this.itemStates = Object.fromEntries(value.map(({ id }) => [id, false]));
      },
      immediate: true
    },
    activeActionItem (id, lastId) {
      console.log(id, lastId);
      const itemStates = { ...this.itemStates };
      lastId !== undefined && (itemStates[lastId] = false);
      itemStates[id] = true;
      this.itemStates = itemStates;
    },

    selectedAction (selectedAction) {
      if (selectedAction) {
        this.actions.push(createAction(selectedAction));
        this.render();
        this.selectedAction = null;
        this.$nextTick(() => {
          this.$refs.list.scrollTo(0, this.$refs.list.scrollHeight);
        });
      }
    }
  },

  async  mounted () {
    await loadFonts();
    this.render();
    this.ready = true;

    this.subscriptions = [fromEvent(global, 'dragenter').subscribe((e) => {
      if (e.target.closest('li [data-id]')) {
        const el = e.target.closest('li [data-id]');
        this.dragTarget = {
          id: el.dataset.id,
          before: el.classList.contains('before')
        };
      }
      console.log(e.target);
    })];
  },
  destroyed () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  },
  methods: {

    render () {
      this.previewItems = executeActions(this.actions, this.colors);
    },

    updateAction (index, value) {
      const actions = this.actions;
      console.log('updateAction', index, value);
      actions[index] = { ...actions[index], value };
      this.actions = actions;
      this.render();
    },

    onClickActionDelete (index) {
      const actions = [].concat(this.actions);
      this.actions = [...actions.slice(0, (index) || 0), ...actions.slice(index + 1)];
      this.render();
    },
    onClickActionUp (index) {
      const actions = [].concat(this.actions);
      const action = actions[Math.max(index - 1, 0)];
      actions[Math.max(index - 1, 0)] = actions[index];
      actions[index] = action;
      this.actions = actions;
      this.render();
    },
    onClickActionDown (index) {
      const actions = [].concat(this.actions);
      const action = this.actions[Math.min(index + 1, actions.length - 1)];
      actions[Math.min(index + 1, actions.length - 1)] = actions[index];
      actions[index] = action;
      this.actions = actions;
      this.render();
    },

    onDragStart (e) {
      global.setTimeout(() => {
        this.dragId = e.target.dataset.id;
        this.isDrag = true;
      }, 100);
    },
    onDrop (e) {
      console.log(e);
      const { id, before } = this.dragTarget;
      let actions = [].concat(this.actions);
      const index = actions.indexOf(actions.find(action => action.id === id));
      const dragIndex = actions.indexOf(actions.find(action => action.id === this.dragId));
      const action = actions.splice(dragIndex, 1);
      if (dragIndex > index) {
        actions = [...actions.slice(0, index + 1), ...action, ...actions.slice(index + 1)];
      } else {
        actions = [...actions.slice(0, index), ...action, ...actions.slice(index)];
      }

      this.actions = actions;
      this.dragId = null;
      this.dragTarget = null;
      this.isDrag = false;
      this.render();
    },
    allowDrop (e) {
      e.preventDefault();
    }
  }
};

export const writeHeadline = (text) => {
  return [
    { type: 'reset' },
    { type: 'feedPitch', value: { value: 2, type: 'font' } },
    { type: 'setDensity', value: 15 },
    { type: 'text', value: text },
    { type: 'reset' },
    { type: 'feedPitch', value: { value: 2, type: 'font' } }];
};

function exampleData () {
  return [
    // { type: 'setAlign', value: ALIGN.LEFT },
    // { type: 'text', value: 'Test Text 1' },
    // { type: 'setAlign', value: ALIGN.CENTER },
    // { type: 'text', value: 'Test Text 2' },
    // { type: 'setAlign', value: ALIGN.RIGHT },
    // { type: 'text', value: 'Test Text 3' },
    // { type: 'setFont', value: FONT.SIZE_8_16_THIN_1 },

    // { type: 'setMargin', value: 1 / 3 },
    // { type: 'setFont', value: FONT.SIZE_8_16_THIN_1 },
    // { type: 'setLineSpace', value: 20 },
    // { type: 'setWordGap', value: 10 },
    // { type: 'setDensity', value: 7 },

    { type: 'image' },
    { type: 'reset' },
    { type: 'setAlign', value: ALIGN.CENTER },
    { type: 'image' },
    { type: 'setAlign', value: ALIGN.RIGHT },
    { type: 'image' },
    { type: 'reset' },

    { type: 'font', value: FONT.SIZE_8_16_THIN_1 },

    ...writeHeadline('Text:'),
    { type: 'text', value: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' },

    // { type: 'text', value: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' },

    { type: 'feedPitch', value: { value: 2, type: 'font' } },

    ...writeHeadline('Align:'),

    { type: 'setAlign', value: ALIGN.LEFT },
    { type: 'text', value: 'Left' },
    { type: 'setAlign', value: ALIGN.CENTER },
    { type: 'text', value: 'Center' },
    { type: 'setAlign', value: ALIGN.RIGHT },
    { type: 'text', value: 'Right' },
    { type: 'feedPitch', value: { value: 2, type: 'font' } },

    ...writeHeadline('Align with 1/3 Margin:'),

    { type: 'setMargin', value: 1 / 3 },
    { type: 'setAlign', value: ALIGN.LEFT },
    { type: 'text', value: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' },
    { type: 'feedPitch', value: { value: 1, type: 'font' } },
    { type: 'setAlign', value: ALIGN.CENTER },
    { type: 'text', value: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' },
    { type: 'feedPitch', value: { value: 1, type: 'font' } },
    { type: 'setAlign', value: ALIGN.RIGHT },
    { type: 'text', value: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' },

    ...writeHeadline('Word Gap:'),
    ...Array(11).fill(0).map((v, index) => {
      return [
        { type: 'setWordGap', value: index },
        { type: 'text', value: `Word Gap ${index}px` }
      ];
    }).flat(),

    ...writeHeadline('Line Height:'),
    ...Array(10).fill(0).map((v, index) => {
      const value = 16 + index * 2;
      return [
        { type: 'setLineSpace', value },
        { type: 'text', value: `Line Space ${value}px` }
      ];
    }).flat(),

    ...writeHeadline('Density:'),
    ...Array(MAX_DENSITY).fill(0).map((v, index) => {
      return [
        { type: 'setDensity', value: index },
        { type: 'text', value: `Density ${index}` }
      ];
    }).flat()

    // { type: 'setDensity', value: 15 },
    // { type: 'text', value: 'Test 1 2 3' },
    // { type: 'feedPitch', value: { value: 4, type: 'font' } },
    // // { type: 'reset' },
    // { type: 'cutLine' },
    // { type: 'feedPitch', value: { value: 2, type: 'font' } }
    // { type: 'setMargin', value: 1 / 3 },
    // { type: 'setAlign', value: ALIGN.LEFT },
    // { type: 'setAlign', value: ALIGN.CENTER },
    // { type: 'text', value: '' },
    // { type: 'text', value: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' },
    // { type: 'text', value: '' },
    // { type: 'setAlign', value: ALIGN.RIGHT },
    // { type: 'text', value: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' }

    // { type: 'text', value: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.' }
    // { type: 'setAlign', value: ALIGN.CENTER },
    // { type: 'text', value: 'Test Text 2' },
    // { type: 'setAlign', value: ALIGN.RIGHT },
    // { type: 'text', value: 'Test Text 3' }
  ].map(data => new ActionDescription(data));
}

</script>

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

body {
  margin: 0;
  font-size: 16px;
  background: var(--color-background);
}

.empty-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.app {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 1280px;
  height: 480px;
  font-family: monospace;
  color: var(--color-primary);

  & > .head {
    height: calc(22 / 16 * 1em);
    border-bottom: solid var(--color-primary) calc(2 / 16 * 1em);

    & ul {
      display: flex;
      padding: 0 calc(8 / 16 * 1em);
      margin: 0;
      list-style: none;

      & li {
        padding: 0 calc(8 / 16 * 1em);
        font-size: calc(12 / 16 * 1em);
        line-height: calc(20 / 12);
        color: var(--color-secondary);
        background: var(--color-primary);
      }
    }
  }

  & > .content {
    position: relative;
    display: flex;
    height: calc(100% - (22 / 16 * 1em));

    /* flex: 1; */

    & > span:last-child {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;

      &::before,
      &::after {
        position: absolute;
        left: 0;
        width: 100%;
        height: calc(16 / 16 * 1em);
        content: "";
      }

      &::before {
        top: 0;
        background: linear-gradient(0deg, rgb(0 0 0 / 0%) 40%, rgb(0 0 0 / 100%) 100%);
      }

      &::after {
        bottom: 0;
        background: linear-gradient(0deg, rgb(0 0 0 / 100%) 40%, rgb(0 0 0 / 0%) 100%);
      }
    }
  }
}

.actions {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  padding: 0 calc(8 / 16 * 1em);

  & .list {
    height: calc(100% - (32px + 32px));
    overflow: auto;
  }

  & .add-action {
    flex: 0;
    height: calc(32 / 16 * 1em);
    margin: calc(16 / 16 * 1em) 0;
    margin-bottom: calc(8 / 16 * 1em);
  }

  & ul {
    box-sizing: border-box;
    height: 100%;
    padding: 0;
    padding: calc(4 / 16 * 1em) 0;
    margin: 0;
    overflow: auto;
    list-style: none;
  }

  & li {
    display: block;
    padding: 4px 0;

    & + li {
      /* margin-top: 10px; */
      padding-top: 4px;
    }
  }
}

.action-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & > * {
    margin: 0 calc(4 / 16 * 1em);
  }

  & .index {
    font-size: calc(13 / 16 * 1em);
    opacity: 0.6;
  }
}

.preview {
  position: relative;
  width: 50%;
  height: 100%;

  & > div {
    height: 100%;
    overflow: auto;

    & > div {
      width: 384px;
      padding: 0 calc(((58/50) * 384px - 384px) / 2);
      margin: 48px auto;
      border: dashed var(--color-primary-40);
      border-width: 1px;
      box-shadow: 0 0 1em rgb(0 0 0 / 20%);

      & > div {
        background: black;
      }
    }
  }
}

.controls {
  display: flex;
  flex-direction: column;
  width: 50%;
  background: #b6bab5;
  border-left: solid #b6bab5 4px;
  box-shadow: 0 0 1em rgb(0 0 0 / 20%);

  & > * {
    flex: 1;
    height: 50%;
  }
}

strong {
  font-weight: bold;
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

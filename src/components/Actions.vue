<template>
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
            v-for="(action, index) in model"
            :id="`anchor-action-item-${action.id}`"
            :key="`${action.id}`"
          >
            <component
              :is="getComponentByType(action.type)"
              :id="action.id"
              :focus="dragTarget && dragTarget.id === action.id && action.id !== dragId"
              :value="action.value"
              :item-states="itemStates"
              :data-id="action.id"
              :colors="colors"
              :draggable="!itemStates[action.id]"
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
</template>

<script>
import { fromEvent } from 'rxjs';
import { getComponentByType, getActionTypeOptions, createAction } from '@/utils/action';
import InputIconButton from '@/components/inputs/IconButton';
import InputDropDown from '@/components/inputs/DropDown';
import SvgIconArrowUp from '@/assets/svg/icons/arrow-up.svg?vue-template';
import SvgIconArrowDown from '@/assets/svg/icons/arrow-down.svg?vue-template';
import SvgIconTrash from '@/assets/svg/icons/trash.svg?vue-template';

export default {
  components: {
    SvgIconArrowUp,
    SvgIconArrowDown,
    SvgIconTrash,
    InputIconButton,
    InputDropDown
  },
  props: {
    value: {
      type: Array,
      default () {
        return [];
      }
    },
    colors: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      getComponentByType,
      activeActionItem: null,
      selectedAction: null,
      actionTypeOptions: getActionTypeOptions(),
      itemStates: {},
      isDrag: false,
      dragId: null,
      dragTarget: null,
      model: [...this.value]
    };
  },
  watch: {

    model: {
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
      if (id) {
        const anchorEl = document.querySelector(`#anchor-action-${id}`);
        anchorEl && anchorEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    },

    selectedAction (selectedAction) {
      if (selectedAction) {
        const action = createAction(selectedAction);
        this.updateModel([].concat(this.model, action));
        this.$nextTick(() => {
          this.selectedAction = null;
          const anchorEl = this.$refs.list.querySelector(`#anchor-action-item-${action.id}`);
          anchorEl && anchorEl.scrollIntoView({ block: 'center' });
          global.setTimeout(() => {
            this.activeActionItem = action.id;
          }, 600);
        });
      }
    }
  },
  mounted () {
    this.subscriptions = [fromEvent(global, 'dragenter').subscribe((e) => {
      if (e.target.closest('li [data-id]')) {
        const el = e.target.closest('li [data-id]');
        this.dragTarget = {
          id: el.dataset.id,
          before: el.classList.contains('before')
        };
      }
    })];
  },
  destroyed () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  },
  methods: {
    updateModel (model) {
      this.model = model;
      this.$emit('input', [...model]);
    },

    updateAction (index, value) {
      const actions = this.model;
      console.log('updateAction', index, value);
      actions[index] = { ...actions[index], value };
      this.updateModel(actions);
    },

    onClickActionDelete (index) {
      const actions = [].concat(this.model);
      this.updateModel([...actions.slice(0, (index) || 0), ...actions.slice(index + 1)]);
    },
    onClickActionUp (index) {
      const actions = [].concat(this.model);
      const action = actions[Math.max(index - 1, 0)];
      actions[Math.max(index - 1, 0)] = actions[index];
      actions[index] = action;
      this.updateModel(actions);
    },
    onClickActionDown (index) {
      const actions = [].concat(this.model);
      const action = this.model[Math.min(index + 1, actions.length - 1)];
      actions[Math.min(index + 1, actions.length - 1)] = actions[index];
      actions[index] = action;
      this.updateModel(actions);
    },

    onDragStart (e) {
      global.setTimeout(() => {
        this.dragId = e.target.dataset.id;
        this.isDrag = true;
      }, 100);
    },
    onDrop (e) {
      const { id } = this.dragTarget;
      let actions = [].concat(this.model);
      const index = actions.indexOf(actions.find(action => action.id === id));
      const dragIndex = actions.indexOf(actions.find(action => action.id === this.dragId));
      const action = actions.splice(dragIndex, 1);
      if (dragIndex > index) {
        actions = [...actions.slice(0, index + 1), ...action, ...actions.slice(index + 1)];
      } else {
        actions = [...actions.slice(0, index), ...action, ...actions.slice(index)];
      }

      this.model = actions;
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
</script>

<style lang="postcss" scoped>
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
</style>

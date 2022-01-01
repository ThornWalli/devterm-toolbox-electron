<template>
  <app-view class="view-printer">
    <div class="preview">
      <div>
        <div :class="{'has-selected': selectedAction}">
          <div v-if="previewItems.length < 1" class="empty-actions">
            Add a Action!
          </div>
          <div v-for="(item, index) in previewItems" :id="`anchor-action-${item.id}`" :key="index" :class="{'selected' : selectedAction && selectedAction.id === item.id}">
            <component
              :is="item.component"
              :key="JSON.stringify(item.options)"
              v-bind="item.props"
              :options="item.options"
              :colors="colors"
            />
          </div>
        </div>
      </div>
      <input-text-button color="primary" class="print-button" disabled>
        Print
      </input-text-button>
    </div>
    <actions
      :value="actions"
      :colors="colors"
      @input="actions = $event"
      @selectAction="selectedAction = $event"
    />
  </app-view>
</template>

<script>
import { executeActions, ActionDescription } from '@/utils/action';
import AppView from '@/components/app/View';
import InputIconButton from '@/components/inputs/IconButton';
import InputTextButton from '@/components/inputs/TextButton';
import InputDropDown from '@/components/inputs/DropDown';
import Actions from '@/components/Actions';

import testData from '@/data/test';

export default {
  components: {
    AppView,

    InputIconButton,
    InputTextButton,
    InputDropDown,
    Actions
  },

  props: {
    colors: {
      type: Object,
      default () {
        return {};
      }
    }
  },

  data () {
    return {
      actions: exampleData(),
      previewItems: [],
      selectedAction: null
    };
  },
  watch: {
    actions () {
      this.render();
    }
  },

  mounted () {
    this.render();
  },

  methods: {

    render () {
      this.loading = true;
      global.clearTimeout(this.renderTimeout);
      this.renderTimeout = global.setTimeout(() => {
        this.previewItems = executeActions(this.actions);
        this.$nextTick(() => {
          this.loading = false;
        });
      }, 500);
    }

  }

};

function exampleData () {
  return testData.map(data => new ActionDescription(data));
}

</script>

<style lang="postcss" scoped>
.view-printer {
  display: flex;

  & .empty-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
  }

  & .print-button {
    margin: calc(8 / 12 * 1em);
  }

  & .preview {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;

    & > div {
      flex: 1;

      /* height: 100%; */
      overflow: auto;

      & > div {
        width: 384px;
        padding: 0 calc(((58/50) * 384px - 384px) / 2);
        margin: 48px auto;
        border: dashed var(--color-primary-40);
        border-width: 1px;
        box-shadow: 0 0 1em rgb(0 0 0 / 20%);

        &.has-selected {
          & > div {
            opacity: 0.4;

            &.selected {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
</style>

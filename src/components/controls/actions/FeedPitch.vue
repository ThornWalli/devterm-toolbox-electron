<template>
  <controls-action-item class="action-feed-pitch" :title="title" v-bind="$attrs" v-on="$listeners">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-dropdown
        v-model="model.type"
        :label="'By'"
        :options="options"
      />
      <input-text-field
        v-model="model.value"
        step="1"
        max="100"
        min="0"
        type="number"
        label="Value"
      />
    </template>
  </controls-action-item>
</template>

<script>
import ControlsActionItem from '@/components/controls/ActionItem';
import InputDropdown from '@/components/inputs/DropDown';
import InputTextField from '@/components/inputs/TextField';
import { DropDownOptionDescription } from '@/components/base/DropDown';
export default {
  components: { ControlsActionItem, InputDropdown, InputTextField },
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default () {
        return {
          type: 'font',
          value: 0
        };
      }
    }
  },
  data () {
    return {
      label: 'Select align',
      options: [
        ['Pixel', 'pixel'],
        ['Font-Size', 'font']
      ].map(([title, value]) => new DropDownOptionDescription({ title, value })),
      model: { ...this.value }

    };
  },
  computed: {
    title () {
      const { value } = this.value;
      return `Feed-Pitch: ${value}`;
    }
  },
  watch: {
    model: {
      handler () {
        this.$emit('input', this.model);
      },
      deep: true
    }
  }
};
</script>

<style lang="postcss" scoped>
.action-set-align {
  /* empty */
}
</style>

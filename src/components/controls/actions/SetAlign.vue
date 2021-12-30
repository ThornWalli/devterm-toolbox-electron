<template>
  <controls-action-item class="action-set-align" :title="title" v-bind="$attrs" v-on="$listeners">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-dropdown :label="label" :options="options" @input="$emit('input', $event)" />
    </template>
  </controls-action-item>
</template>

<script>
import { ALIGN } from 'node-devterm/config';
import ControlsActionItem from '@/components/controls/ActionItem';
import InputDropdown from '@/components/inputs/DropDown';
import { DropDownOptionDescription } from '@/components/base/DropDown';
export default {
  components: { ControlsActionItem, InputDropdown },
  inheritAttrs: false,
  props: {
    value: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      label: 'Select align',
      options: [
        ['Left', ALIGN.LEFT],
        ['Center', ALIGN.CENTER],
        ['Right', ALIGN.RIGHT]
      ].map(([title, value]) => new DropDownOptionDescription({ title, value }))

    };
  },
  computed: {
    title () {
      return `Align: ${Object.entries(ALIGN).find(([title, value]) => Number(this.value) === value)[0]}`;
    }
  }
};
</script>

<style lang="postcss" scoped>
.action-set-align {
  /* empty */
}
</style>

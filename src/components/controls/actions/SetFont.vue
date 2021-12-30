<template>
  <controls-action-item class="action-set-font" :title="title" v-bind="$attrs" v-on="Object.assign({}, $listeners, {input:[]})">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-dropdown :label="label" :options="options" :value="value" @input="$emit('input', $event)" />
    </template>
  </controls-action-item>
</template>

<script>
import { FONT } from 'node-devterm/config';
import ControlsActionItem from '@/components/controls/ActionItem';
import InputDropdown from '@/components/inputs/DropDown';
import { DropDownOptionDescription } from '@/components/base/DropDown';
export default {
  components: { ControlsActionItem, InputDropdown },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
      label: 'Select font',
      options: Object.keys(FONT).map((value) => new DropDownOptionDescription({ title: value, value: FONT[value] }))

    };
  },
  computed: {
    title () {
      return `Font: ${Object.entries(FONT).find(([title, value]) => Number(this.value) === value)[0]}`;
    }
  }
};
</script>

<style lang="postcss" scoped>
.action-set-font {
  /* empty */
}
</style>

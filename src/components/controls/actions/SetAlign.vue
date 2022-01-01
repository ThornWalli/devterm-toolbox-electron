<template>
  <action-dialog title="Set Align" class="action-dialog-set-align" v-bind="$attrs" v-on="Object.assign({}, $listeners, {input:[]})">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-dropdown :label="label" :value="String(value)" :options="options" @input="$emit('input', Number($event))" />
    </template>
  </action-dialog>
</template>

<script>
import { ALIGN } from 'node-devterm/config';

import ActionDialog from '@/components/controls/ActionDialog';
import MixinDialog from '@/mixins/Dialog';

import InputDropdown from '@/components/inputs/DropDown';
import { DropDownOptionDescription } from '@/components/base/DropDown';

export default {
  components: { ActionDialog, InputDropdown },
  mixins: [MixinDialog],
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
      ].map(([title, value]) => new DropDownOptionDescription({ title, value: String(value) }))

    };
  }
};
</script>

<style lang="postcss" scoped>
.action-dialog-set-align {
  /* empty */
}
</style>

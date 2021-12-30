<template>
  <controls-action-item class="action-set-density" :title="title" v-bind="$attrs" v-on="$listeners">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-dropdown :label="label" :options="options" :value="value" @input="$emit('input', $event)" />
    </template>
  </controls-action-item>
</template>

<script>
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
      label: 'Set Density',
      options: Array(15).fill('').map((v, index) => new DropDownOptionDescription(String(index + 1)))
    };
  },
  computed: {
    title () {
      return `Density: ${this.value}`;
    }
  }
};
</script>

<style lang="postcss" scoped>
.action-set-density {
  /* empty */
}
</style>

<template>
  <controls-action-item class="action-set-margin" :title="title" v-bind="$attrs" v-on="Object.assign({}, $listeners, {input:[]})">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-text-field
        step="0.01"
        max="1"
        min="0"
        type="number"
        :value="value"
        :label="label"
        @input="$emit('input', $event)"
      />
    </template>
  </controls-action-item>
</template>

<script>
import ControlsActionItem from '@/components/controls/ActionItem';
import InputTextField from '@/components/inputs/TextField';
export default {
  components: { ControlsActionItem, InputTextField },
  inheritAttrs: false,

  props: {
    value: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      label: 'Set Margin'
    };
  },
  computed: {
    title () {
      return `Margin: ${this.value}`;
    }
  }
};
</script>

<style lang="postcss" scoped>
.action-set-margin {
  /* empty */
}
</style>

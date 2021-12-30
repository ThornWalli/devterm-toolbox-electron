<template>
  <controls-action-item class="action-set-line-space" :title="title" v-bind="$attrs" v-on="$listeners">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-text-field
        step="1"
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
      label: 'Set Line-space'
    };
  },
  computed: {
    title () {
      return `Line-space: ${this.value}`;
    }
  }
};
</script>

<style lang="postcss" scoped>
.action-set-line-space {
  /* empty */
}
</style>

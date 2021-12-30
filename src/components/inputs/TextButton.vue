<template>
  <base-generic-button class="input-text-button" :class="{[`color-${color}`]: color}" v-bind="$attrs" v-on="$listeners">
    <slot>{{ text }}</slot>
  </base-generic-button>
</template>

<script>
import BaseGenericButton from '@/components/base/GenericButton';
export default {
  components: {
    BaseGenericButton
  },
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: 'secondary' // primary, secondary
    },
    text: {
      type: String,
      default: 'Text Button'
    }
  }
};
</script>

<style lang="postcss" scoped>
.input-text-button {
  padding: calc(4 / 16 * 1em) calc(8 / 16 * 1em);
  font-family: monospace;
  font-size: calc(12 / 16 * 1em);
  color: var(--color-primary);
  cursor: pointer;
  background: transparent;
  border: solid var(--color-primary) 1px;

  &.color-primary {
    color: var(--color-secondary);
    background: var(--color-primary);
  }

  /* &.color-secondary {
    border: solid currentColor 1px;
  } */

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>

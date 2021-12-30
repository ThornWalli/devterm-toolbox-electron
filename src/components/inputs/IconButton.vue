<template>
  <base-generic-button class="input-icon-button" v-on="$listeners">
    <i>
      <slot><component :is="svg" v-if="svg" /></slot>
    </i>
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
    svg: {
      type: [Object, Function],
      required: false,
      default: null
    }
  }
};
</script>

<style lang="postcss" scoped>
.input-icon-button {
  color: currentColor;
  cursor: pointer;

  & i {
    display: block;
    width: calc(12 / 16 * 1em);
  }

  & >>> svg {
    fill: currentColor;
  }

  &:focus {
    color: var(--color-secondary);
    background: var(--color-primary);
  }
}
</style>

<template>
  <li class="app-menu-item" :class="{'selected': selected}">
    <base-generic-button v-bind="$attrs" v-on="$listeners">
      <slot />
    </base-generic-button>
  </li>
</template>

<script>
import BaseGenericButton from '@/components/base/GenericButton';
export default {

  components: { BaseGenericButton },
  inheritAttrs: false,

  props: {
    selected: {
      type: Boolean,
      default: false
    }
  }

};
</script>

<style lang="postcss" scoped>
.app-menu-item {
  & + .app-menu-item {
    display: flex;
    align-items: center;
  }

  /*
  &:not(:last-child):not(.selected) {
    &::after {
      display: inline-block;
      width: 1px;
      height: 50%;
      content: "";
      background: var(--color-primary);
    }
  } */

  & > * {
    padding: 0 calc(8 / 16 * 1em);
    font-family: monospace;
    font-size: calc(12 / 16 * 1em);
    line-height: calc(20 / 12);
    cursor: pointer;

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &:hover {
    & > *:not([disabled]) {
      color: var(--color-secondary);
      background: var(--color-primary-80);
    }
  }

  &:active,
  &.selected {
    & > *:not([disabled]) {
      color: var(--color-secondary);
      background: var(--color-primary);
    }
  }
}
</style>

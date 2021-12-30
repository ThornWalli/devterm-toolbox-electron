<template>
  <label class="base-input-label" :class="{'top-label': topLabel}">
    <span v-if="text">{{ text }}</span>
    <slot />
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: 'Label'
    },
    topLabel: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="postcss" scoped>
.base-input-label {
  display: flex;
  align-items: center;

  & > span {
    min-width: calc(120 / 12 * 1em);
    font-size: calc(12 / 16 * 1em);

    &::after {
      content: ":";
    }
  }

  &.top-label {
    flex-direction: column;
    align-items: unset;

    & > span {
      margin-bottom: calc(10 / 12 * 1em);
    }
  }

  & + .base-input-label {
    margin-top: calc(8 / 12 * 1em);
  }
}
</style>

<template>
  <button class="base-generic-button" v-on="$listeners">
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Button Text'
    }
  }
};
</script>
<style lang="postcss" scoped>
.base-generic-button {
  padding: 0;
  font-size: 1rem;
  color: currentColor;
  background: none;
  border: none;
  border-radius: 0;
  appearance: none;
  outline: none;
}
</style>

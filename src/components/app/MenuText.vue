<template>
  <li class="app-menu-text">
    <slot />
  </li>
</template>

<script>
export default {

};
</script>
<style lang="postcss" scoped>
.app-menu-text {
  display: flex;
  align-self: center;
  justify-content: center;
  padding: 0 calc(8 / 12 * 1em);
  font-size: calc(12 / 16 * 1em);
}
</style>

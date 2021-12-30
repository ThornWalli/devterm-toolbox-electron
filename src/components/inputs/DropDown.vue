<template>
  <base-input-label class="input-drop-down" :text="label">
    <base-drop-down v-bind="$attrs" v-on="$listeners" />
  </base-input-label>
</template>

<script>
import BaseInputLabel from '@/components/base/InputLabel';
import BaseDropDown from '@/components/base/DropDown';
export default {
  components: {
    BaseInputLabel,
    BaseDropDown
  },
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: 'Dropdown Label'
    }
  }
};
</script>

<style lang="postcss" scoped>
.input-drop-down {
  & >>> select {
    width: 100%;
    padding: 5px;
    font-family: monospace;
    font-size: calc(12 / 16 * 1em);
    color: currentColor;
    background: none;
    border: solid var(--color-primary) 1px;
    border-radius: 0;
    appearance: none;
    outline: none;
  }
}
</style>

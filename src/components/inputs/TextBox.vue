<template>
  <base-input-label top-label class="input-text-box" :text="label">
    <textarea v-bind="$attrs" :value="value" @input="$emit('input', $event.target.value)" />
  </base-input-label>
</template>

<script>
import BaseInputLabel from '@/components/base/InputLabel';
export default {
  components: {
    BaseInputLabel
  },
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: 'TextBox'
    },
    value: {
      type: String,
      default: ''
    }
  }

};
</script>

<style lang="postcss" scoped>
.input-text-box {
  /* empty */
}

textarea {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  font-family: monospace;
  font-size: calc(12 / 16 * 1em);
  line-height: calc(20 / 12);
  color: currentColor;
  resize: none;
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
}
</style>

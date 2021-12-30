<template>
  <base-input-label class="input-text-field" :text="label">
    <input :type="type" v-bind="$attrs" :value="value" @input="$emit('input', $event.target.value)">
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
      default: 'TextField'
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: ''
    }
  }

};
</script>

<style lang="postcss" scoped>
.inputs-text {
  /* empty */
}

input {
  display: block;
  width: 100%;
  height: 100%;
  padding: calc(5 / 12 * 1em);
  font-family: monospace;
  font-size: calc(12 / 16 * 1em);
  color: currentColor;
  resize: none;
  background: transparent;
  border: solid var(--color-primary) calc(1 / 12 * 1em);
  outline: none;
  appearance: none;

  &[type="number"] {
    font-weight: bold;
  }
}
</style>

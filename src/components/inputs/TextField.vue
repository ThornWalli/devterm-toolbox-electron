<template>
  <base-input-label class="input-text-field" :text="label" :top-label="topLabel">
    <input :type="type" v-bind="$attrs" :value="value" @input="onInput">
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
    topLabel: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    onInput (e) {
      global.clearTimeout(this.inputTimeout);
      this.inputTimeout = global.setTimeout(() => {
        this.$emit('input', e.target.value);
      }, 300);
    }
  }

};
</script>

<style lang="postcss" scoped>
.input-text-field {
  /* empty */
}

input {
  box-sizing: border-box;
  display: block;
  width: 100%;
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

  &::placeholder {
    color: var(--color-primary-50);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>

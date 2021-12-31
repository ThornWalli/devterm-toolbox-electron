<template>
  <base-input-label class="input-text-box" :text="label" :top-label="topLabel">
    <textarea v-bind="$attrs" :value="value" @input="onInput" />
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
    topLabel: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return { inputTimeout: null };
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

  &::placeholder {
    color: var(--color-primary-50);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>

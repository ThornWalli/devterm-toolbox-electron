<template>
  <action-dialog class="action-dialog-text" v-bind="$attrs" v-on="Object.assign({}, $listeners, {input:[]})">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-text-box
        class="input"
        placeholder="Enter Text"
        :label="null"
        :value="value"
        rows="10"
        @input="onInput"
      />
      <div class="footer">
        <span>Rows: <span>{{ value.split('\n').length }}</span></span>
      </div>
    </template>
  </action-dialog>
</template>

<script>
import ActionDialog from '@/components/controls/ActionDialog';
import InputTextBox from '@/components/inputs/TextBox';
import MixinDialog from '@/mixins/Dialog';

export default {
  components: { ActionDialog, InputTextBox },
  mixins: [MixinDialog],
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      label: 'Select align'
    };
  },
  methods: {
    onInput (e) {
      this.$emit('input', e);
    }
  }
};
</script>

<style lang="postcss" scoped>
.action-text {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  & .input {
    flex: 1;
  }

  & .footer {
    padding-top: calc(8 / 16 * 1em);
    margin-top: calc(8 / 16 * 1em);
    font-size: calc(12 / 16 * 1em);
    border-top: solid var(--color-primary-50) 1px;

    & > span {
      /* empty */
    }
  }
}

</style>

<template>
  <controls-action-item class="action-native-text" :title="title" v-bind="$attrs" v-on="$listeners">
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
        @input="$emit('input', $event)"
      />
      <div class="footer">
        <span>Rows: <span>{{ value.split('\n').length }}</span></span>
      </div>
    </template>
  </controls-action-item>
</template>

<script>
import ControlsActionItem from '@/components/controls/ActionItem';
import InputTextBox from '@/components/inputs/TextBox';
export default {
  components: { ControlsActionItem, InputTextBox },
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
  computed: {
    title () {
      return `Text: ${this.value.slice(0, 16)}…`;
    }
  }
};
</script>

<style lang="postcss" scoped>
.action-native-text {
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

<template>
  <app-dialog
    ref="dialog"
    :escape-close="false"
    :title="`Error${title? ': '+title : ''}`"
    class="dialog-error"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #default>
      <p>
        {{ message }}
      </p>
    </template>
    <template #buttons>
      <input-text-button color="primary" text="Close" @click="callback(); close()" />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/app/Dialog';
import InputTextButton from '@/components/inputs/TextButton';
import MixinDialog from '@/mixins/Dialog';

export default {
  components: {
    AppDialog,
    InputTextButton
  },
  mixins: [MixinDialog],
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: 'Error Message'
    },
    callback: {
      type: Function,
      default: null
    }
  }
};
</script>

<style lang="postcss" scoped>
.dialog-error {
  --color-primary: red;
  --dialog-width: calc(480 / 16 * 1em);

  & p {
    margin: 0;
    font-size: calc(12 / 16 * 1em);
  }
}
</style>

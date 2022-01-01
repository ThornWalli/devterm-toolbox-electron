<template>
  <app-dialog
    ref="dialog"
    :escape-close="false"
    title="Welcome DevTerm User!"
    class="start-dialog"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #default>
      <p>
        Do you work local or remote?
      </p>
      <input-check-box v-bind="remember" label="Remember choice" delimiter="?" />
    </template>
    <template #buttons>
      <input-text-button color="primary" text="Use Local" @click="onClickLocal" />
      <input-text-button color="primary" text="Use Remote" @click="onClickRemote" />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/app/Dialog';
import InputTextButton from '@/components/inputs/TextButton';
import InputCheckBox from '@/components/inputs/CheckBox';
import MixinDialog from '@/mixins/Dialog';

export default {
  components: {
    AppDialog,
    InputTextButton,
    InputCheckBox
  },
  mixins: [MixinDialog],
  inheritAttrs: false,

  data () {
    return {
      remember: false
    };
  },

  methods: {
    onClickLocal () {
      this.close({
        remember: this.remember,
        type: 'local'
      });
    },
    onClickRemote () {
      this.close({
        remember: this.remember,
        type: 'remote'
      });
    }
  }
};
</script>

<style lang="postcss" scoped>
.start-dialog {
  --dialog-width: calc(480 / 16 * 1em);

  & h2 {
    margin: 0;
    font-size: calc(20 / 16 * 1em);
  }

  & p {
    font-size: calc(12 / 16 * 1em);
  }
}
</style>

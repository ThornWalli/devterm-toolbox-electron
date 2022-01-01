<template>
  <app-dialog
    ref="dialog"
    :escape-close="false"
    title="Options"
    class="dialog-option"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #default>
      <input-text-field v-model="host" label="Host" placeholder="Enter host…" />
      <input-text-field
        type="Number"
        label="Port"
        min="1024"
        step="1"
        :value="port"
        @input="port = parseInt($event)"
      />
      <input-check-box v-bind="remember" label="Remember choice" delimiter="?" />
    </template>
    <template #buttons>
      <input-text-button color="primary" text="Apply" @click="onClickApply" />
      <input-text-button color="primary" text="Close" @click="close()" />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/app/Dialog';
import InputTextButton from '@/components/inputs/TextButton';
import InputTextField from '@/components/inputs/TextField';
import InputCheckBox from '@/components/inputs/CheckBox';
import MixinDialog from '@/mixins/Dialog';
import { getDefaultConfig } from '@/classes/Config';

export default {
  components: {
    AppDialog,
    InputTextButton,
    InputTextField,
    InputCheckBox
  },
  mixins: [MixinDialog],
  inheritAttrs: false,

  props: {
    value: {
      type: Object,
      default: getDefaultConfig()
    }
  },

  data () {
    return {
      model: this.value
    };
  },

  methods: {
    onClickApply () {
      this.$config.set(this.model);
      this.close();
    }
  }
};
</script>

<style lang="postcss" scoped>
.dialog-option {
  --dialog-width: calc(480 / 16 * 1em);
}
</style>

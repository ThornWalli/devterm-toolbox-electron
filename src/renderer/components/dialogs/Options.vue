<template>
  <app-dialog
    ref="dialog"
    :escape-close="false"
    title="Options"
    class="dialog-options"
    v-bind="$attrs"
    v-on="$listeners"
    @open="onDialogOpen"
  >
    <template #default>
      <input-drop-down v-model="model.theme" label="Theme" :options="themeOptions" />
      <hr>
      <input-drop-down v-model="model.startType" label="Start type" :options="startTypeOptions" />
      <input-text-field v-model="model.host" label="Host" placeholder="Enter host…" />
      <input-text-field
        type="Number"
        label="Port"
        min="1024"
        step="1"
        :value="model.port"
        @input="model.port = parseInt($event)"
      />
    </template>
    <template #buttons>
      <input-text-button color="primary" text="Apply" @click="onClickApply" />
      <input-text-button color="secondary" text="Close" @click="close()" />
    </template>
  </app-dialog>
</template>

<script>
import { DropDownOptionDescription } from '@/components/base/DropDown.vue';
import AppDialog from '@/components/app/Dialog.vue';
import InputTextButton from '@/components/inputs/TextButton.vue';
import InputTextField from '@/components/inputs/TextField.vue';
import InputDropDown from '@/components/inputs/DropDown.vue';
import MixinDialog from '@/mixins/Dialog.vue';
import { getDefaultConfig } from '@/../utils/config';

export default {
  components: {
    AppDialog,
    InputTextButton,
    InputTextField,
    InputDropDown
  },
  mixins: [MixinDialog],
  inheritAttrs: false,
  data () {
    return {
      model: getDefaultConfig(),
      themeOptions: [
        ['Amber', 'amber'],
        ['Green', 'green'],
        ['Black & White', 'blackWhite'],
        ['White & Black', 'whiteBlack']
      ].map(([title, value]) => new DropDownOptionDescription({ title, value })),
      startTypeOptions: [
        ['Select start type', ''],
        ['Local', 'local'],
        ['Remote', 'remote']
      ].map(([title, value]) => new DropDownOptionDescription({ title, value }))
    };
  },

  methods: {
    onDialogOpen () {
      this.model = Object.assign({}, this.$config.data);
    },
    onClickApply () {
      this.$config.set(this.model);
      this.$config.save();
      this.close();
    }
  }
};
</script>

<style lang="postcss" scoped>
.dialog-options {
  --dialog-width: calc(480 / 16 * 1em);
}
</style>

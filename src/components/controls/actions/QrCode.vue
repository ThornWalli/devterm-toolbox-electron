<template>
  <action-dialog class="action-dialog-qr-code" v-bind="$attrs" v-on="Object.assign({}, $listeners, {input:[]})">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-text-box v-model="model.text" label="Text" />
      <hr>
      <input-drop-down v-model="model.options.errorCorrectionLevel" :options="errorCorrectionLevelOptions" label="Correc. Lev." />

      <input-text-field
        :value="model.margin"
        type="number"
        label="Margin"
        step="1"
        min="0"
        @input="model.options.margin = $event || 0"
      />
      <input-text-field
        :value="model.scale"
        type="number"
        label="Scale"
        step="1"
        min="0"
        @input="model.options.scale = $event || 0"
      />

      <div class="cols">
        <input-check-box v-model="model.options.small" label="Small" />
        <input-check-box v-model="model.rotate" label="Rotate" />
        <input-check-box v-model="model.flipX" label="Flip X" />
        <input-check-box v-model="model.flipY" label="Flip Y" />
      </div>
      <input-text-field
        v-model="model.width"
        type="number"
        min="1"
        step="1"
        label="width"
        placeholder="Size from Image (max. 384px)"
      />
    </template>
  </action-dialog>
</template>

<script>
// import { prepareCanvasForPrint } from 'node-devterm/utils/canvas';
// import { MAX_IMAGE_WIDTH } from '@/config';
// import { getCanvasFromUrl, preparePreview, resizeCanvas, toDataURL } from '@/utils/canvas';

import ActionDialog from '@/components/controls/ActionDialog';
import MixinDialog from '@/mixins/Dialog';

import InputCheckBox from '@/components/inputs/CheckBox';
import InputDropDown from '@/components/inputs/DropDown';
import InputTextField from '@/components/inputs/TextField';
import InputTextBox from '@/components/inputs/TextBox';

import { DropDownOptionDescription } from '@/components/base/DropDown.vue';
import { getDefaultQRCodeOptions } from '@/utils/action';
export default {
  components: { ActionDialog, InputCheckBox, InputDropDown, InputTextField, InputTextBox },
  mixins: [MixinDialog],
  inheritAttrs: false,
  props: {
    colors: {
      type: Object,
      default () {
        return {
          primary: [255, 0, 0],
          secondary: [0, 255, 0]
        };
      }
    },
    value: {
      type: Object,
      default () {
        return getDefaultQRCodeOptions();
      }
    }
  },
  data () {
    return {
      type: 'text',
      model: { ...this.value },
      errorCorrectionLevelOptions: [
        ['Low', 'L'],
        ['Medium', 'M'],
        ['Quartile', 'Q'],
        ['High', 'H']
      ].map(([title, value]) => new DropDownOptionDescription({ title, value })),
      typeOptions: [
        ['Text', 'text'],
        ['Url', 'url']
      ].map(([title, value]) => new DropDownOptionDescription({ title, value }))
    };
  },
  watch: {
    model: {
      handler () {
        global.clearTimeout(this.updateTimeout);
        this.updateTimeout = global.setTimeout(() => {
          this.$emit('input', { ...this.model });
        }, 500);
      },
      deep: true
    }
  }
};

</script>

<style lang="postcss" scoped>
.action-dialog-qr-code {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  & .input {
    flex: 1;
  }

  & .cols {
    display: flex;
    flex-wrap: wrap;

    & > * {
      width: 50%;
    }

    margin: calc(8 / 16 * 1em) 0;
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

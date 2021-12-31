<template>
  <action-dialog class="action-dialog-barcode" v-bind="$attrs" v-on="Object.assign({}, $listeners, {input:[]})">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <input-text-box v-model="model.text" label="Text" />
      <hr>
      <input-drop-down v-model="model.options.format" :options="formatOptions" label="Format" />
      <div class="cols">
        <div>
          <input-drop-down
            v-model="model.options.font"
            top-label
            :options="fontOptions"
            label="Font"
          />
        </div>
        <div>
          <input-drop-down
            v-model="model.options.textAlign"
            top-label
            :options="textAlignOptions"
            label="Text Align"
          />
        </div>
        <div>
          <input-drop-down
            v-model="model.options.textPosition"
            top-label
            :options="textPositionOptions"
            label="Text Position"
          />
        </div>

        <div>
          <input-text-field
            :value="model.options.textMargin"
            top-label
            type="number"
            min="0"
            step="1"
            label="Text Margin"
            @input="model.options.textMargin = Number($event || 0)"
          />
        </div>
        <div>
          <input-text-field
            top-label
            type="number"
            min="1"
            step="1"
            label="Font Size"
            :value="model.options.fontSize"
            @input="model.options.fontSize = Number($event || 1)"
          />
        </div>
        <div>
          <input-text-field
            top-label
            type="number"
            min="0"
            step="1"
            label="Margin"
            :value="model.options.margin"
            @input="model.options.margin = Number($event || 0)"
          />
        </div>
        <div>
          <input-check-box v-model="model.options.displayValue" label="Display Value" />
        </div>
        <div>
          <input-check-box v-model="model.options.flat" label="Flat" />
        </div>
      </div>
      <!-- <input-drop-down v-model="model.options.errorCorrectionLevel" :options="errorCorrectionLevelOptions" label="Correc. Lev." />

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
      </div> -->
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
import { FONT_MAP } from '@/utils/font';
import { getDefaultBarcodeValue } from '@/utils/action';

export default {
  // eslint-disable-next-line vue/no-unused-components
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
        return getDefaultBarcodeValue();
      }
    }
  },
  data () {
    return {
      type: 'text',
      model: { ...this.value },
      formatOptions: [
        ['Auto', ''],

        // CODE128
        ['CODE128', 'CODE128'],
        ['CODE128 A', 'CODE128A'],
        ['CODE128 B', 'CODE128B'],
        ['CODE128 C', 'CODE128C'],
        // EAN
        ['EAN13', 'EAN13'],
        ['UPC', 'UPC'],
        ['EAN8', 'EAN8'],
        ['EAN5', 'EAN5'],
        ['EAN2', 'EAN2'],

        ['CODE39', 'CODE39'],
        ['ITF-14', 'ITF14'],

        ['MSI', 'MSI'],
        ['MSI10', 'MSI10'],
        ['MSI11', 'MSI11'],
        ['MSI1010', 'MSI1010'],
        ['MSI1110', 'MSI1110'],

        ['Pharmacode', 'pharmacode'], // 1234
        ['Codabar', 'codabar'] // 1234567890 || C1234567890D
      ].map(([title, value]) => new DropDownOptionDescription({ title, value })),
      fontOptions: [
        ['Sans Serif', 'sans-serif'],
        ['Serif', 'serif'],
        ['monospace', 'monospace'],
        ['Fantasy', 'fantasy'],
        ['Cursive', 'cursive'],
        ...Array.from(new Set(Object.values(FONT_MAP).map(({ fontFamily }) => fontFamily))).map(fontFamily => [fontFamily, fontFamily])

      ].map(([title, value]) => new DropDownOptionDescription({ title, value })),

      textAlignOptions: [
        ['Left', 'left'],
        ['Center', 'center'],
        ['Right', 'right']
      ].map(([title, value]) => new DropDownOptionDescription({ title, value })),

      textPositionOptions: [
        ['Top', 'top'],
        ['Bottom', 'bottom']
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
.action-dialog-barcode {
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
      box-sizing: border-box;
      width: 50%;
      padding: calc(4 / 16 * 1em);
    }

    margin: calc(8 / 16 * 1em) calc(-4 / 16 * 1em);
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

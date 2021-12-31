<template>
  <action-dialog class="action-dialog-image" v-bind="$attrs" v-on="Object.assign({}, $listeners, {input:[]})">
    <template #head>
      <slot name="head" />
    </template>
    <template #default>
      <div v-if="previewDataUrl" class="preview">
        <img :src="previewDataUrl">
      </div>
      <input-file-select label="File" @input="onInputFileSelect" />

      <div class="cols">
        <input-check-box v-model="model.grayscale" label="Grayscale" />
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
import { prepareCanvasForPrint } from 'node-devterm/utils/canvas';
import { MAX_IMAGE_WIDTH } from '@/config';
import { getCanvasFromUrl, preparePreview, resizeCanvas, toDataURL } from '@/utils/canvas';

import ActionDialog from '@/components/controls/ActionDialog';
import MixinDialog from '@/mixins/Dialog';

import InputCheckBox from '@/components/inputs/CheckBox';
import InputTextField from '@/components/inputs/TextField';
import InputFileSelect from '@/components/inputs/FileSelect';
export default {
  components: { ActionDialog, InputCheckBox, InputTextField, InputFileSelect },
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
        return { file: null, width: null, rotate: false, flipX: false, flipY: false, grayscale: false };
      }
    }
  },
  data () {
    return {
      previewDataUrl: null,
      model: { ...this.value }
    };
  },
  watch: {
    model: {
      handler () {
        global.clearTimeout(this.updateTimeout);
        this.updateTimeout = global.setTimeout(() => {
          this.render();
          this.$emit('input', { ...this.model });
        }, 500);
      },
      deep: true
    }
  },
  mounted () {
    this.render();
  },
  methods: {
    onInput (e) {
      this.$emit('input', e);
    },
    async onInputFileSelect (file) {
      const url = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      this.updateCanvas(url);
    },

    async updateCanvas (url) {
      let canvas = await getCanvasFromUrl(url);
      canvas = resizeCanvas(canvas, MAX_IMAGE_WIDTH);
      this.model = { ...this.model, file: toDataURL(canvas) };
      this.render();
    },

    async render () {
      let canvas = await getCanvasFromUrl(this.model.file);
      canvas = prepareCanvasForPrint(canvas, this.model, this.colors);
      canvas = preparePreview(canvas, this.colors);
      canvas = resizeCanvas(canvas, null, 100);
      this.previewDataUrl = toDataURL(canvas);
    },

    async loadFromUrl () {
      try {
        await this.updateCanvas(this.url);
      } catch (error) {
        console.error(error);
      }
    }
  }
};

</script>

<style lang="postcss" scoped>
.action-dialog-image {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  & .preview {
    display: flex;
    justify-content: center;
    margin: calc(8 / 16 * 1em) 0;
    margin-bottom: calc(16 / 16 * 1em);
  }

  & .input {
    flex: 1;
  }

  & .cols {
    column-count: 2;
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

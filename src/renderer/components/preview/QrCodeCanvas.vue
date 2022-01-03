<template>
  <canvas />
</template>

<script>
import { getQRCode, prepareCanvasForPrint } from 'node-devterm/utils/canvas';
import { ALIGN } from 'node-devterm/config';
import { preparePreview } from '@/../utils/canvas';
import { getDefaultQRCodeOptions } from '@/../utils/action';

export default {
  props: {
    colors: {
      type: Object,
      default () {
        return { base: [255, 0, 0] };
      }
    },
    value: {
      type: Object,
      default () {
        return getDefaultQRCodeOptions();
      }
    },
    width: {
      type: Number,
      default: 384
    },
    options: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      ctx: null
    };
  },

  watch: {
    async value () {
      if (this.value.file) {
        await this.changeImage(this.value.file);
      }
      this.render();
    }
  },
  async mounted () {
    this.$el.width = this.width;
    this.ctx = this.$el.getContext('2d');

    this.value.file && await this.changeImage(this.value.file);
    this.render();
  },

  methods: {
    changeImage (url) {
      return new Promise(resolve => {
        this.img = document.createElement('img');
        this.img.onload = () => {
          this.$el.height = this.img.naturalHeight;
          resolve();
        };
        this.img.src = url;
      });
    },
    getColor (opacity) {
      return `rgb(${this.colors.primary.join(' ')} / ${opacity * 100}%)`;
    },
    render () {
      window.requestAnimationFrame(async () => {
        const preparedCanvas = prepareCanvasForPrint(await getQRCode(this.value.text || 'empty', this.value.options || {}), this.value.imageOptions);

        const ctx = this.ctx;
        ctx.canvas.width = this.width;
        ctx.canvas.height = preparedCanvas.height;

        const width = this.width;
        const margin = parseInt(this.options.margin * width);
        let x = 0;
        switch (this.options.align) {
          case ALIGN.RIGHT:
            x += this.width - preparedCanvas.width;
            break;
          case ALIGN.CENTER:
            x += (this.width - preparedCanvas.width) / 2;
            break;
          default:
            x += margin;
            break;
        }
        ctx.drawImage(preparedCanvas, x, 0);
        preparePreview(ctx.canvas, this.colors);
      });
    }
  }
};

</script>

<style lang="postcss" scoped>
canvas {
  display: block;

  /* background: white; */
}
</style>

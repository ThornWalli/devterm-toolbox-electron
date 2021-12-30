<template>
  <canvas />
</template>

<script>
import { createCanvas, prepareCanvasForPrint } from 'node-devterm/utils/canvas';
import { ALIGN } from 'node-devterm/config';

export default {
  props: {
    colors: {
      type: Object,
      default () {
        return { base: [255, 0, 0] };
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
      ctx: null,
      img: null
    };
  },

  //   watch: {
  //     value () {
  //       this.render();
  //     }
  //   },
  async mounted () {
    this.$el.width = this.width;
    this.ctx = this.$el.getContext('2d');

    await new Promise(resolve => {
      this.img = document.createElement('img');
      this.img.onload = () => resolve();
      this.img.src = require('@/assets/img/devterm.jpeg').default;
    });
    this.$el.height = this.img.naturalHeight;

    this.render();
  },

  methods: {
    getColor (opacity) {
      return `rgb(${this.colors.primary.join(' ')} / ${opacity * 100}%)`;
    },
    render () {
      global.requestAnimationFrame(() => {
        const imageCanvas = createCanvas(this.img.naturalWidth, this.img.naturalHeight);
        // imageCanvas.width = this.img.naturalWidth;
        // imageCanvas.height = this.img.naturalHeight;
        const imageContext = imageCanvas.getContext('2d');
        imageContext.drawImage(this.img, 0, 0);
        const invertColors = (data) => {
          for (let i = 0; i < data.length; i += 4) {
            // data[i] = data[i] ^ 255; // Invert Red
            // data[i + 1] = data[i + 1] ^ 255; // Invert Green
            // data[i + 2] = data[i + 2] ^ 255; // Invert Blue
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
              data[i] = this.colors.primary[0];
              data[i + 1] = this.colors.primary[1];
              data[i + 2] = this.colors.primary[2];
            }
            if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
              data[i] = this.colors.secondary[0];
              data[i + 1] = this.colors.secondary[1];
              data[i + 2] = this.colors.secondary[2];
            }
          }
        };
        const preparedCanvas = prepareCanvasForPrint(imageCanvas, { grayscale: true, width: 100 });

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
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        invertColors(imageData.data);

        // Update the canvas with the new data
        ctx.putImageData(imageData, 0, 0);
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

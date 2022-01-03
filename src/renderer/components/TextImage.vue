<template>
  <canvas />
</template>

<script>
import canvas from 'canvas';
import {
  getCanvasFromImage, splitCanvasInImageDataChunks, getBitRowsFromImageData,
  flipCanvas,
  rotateCanvas90Deg
} from 'node-devterm/utils/image';
const { Canvas } = canvas;

export default {
  async mounted () {
    const data = await this.writeImage(require('@/assets/img/devterm.jpeg').default);
    console.log(data);
  },
  methods: {

    /**
   * Write  Image from path or url, with optional width.
   * @param String url
   * @param Number width
   * @returns Promise
   */
    async writeImage (url, options) {
      return this.writeCanvas(await getCanvasFromImage(url), options);
    },

    /**
   * Write Canvas with optional width.
   * @param Canvas canvas
   * @param Object options
   * @returns Promise
   */
    async writeCanvas (canvas, options) {
      options = { width: null, rotate: false, flipX: false, flipY: false, ...options };

      if (!(canvas instanceof Canvas)) {
        throw new TypeError('canvas is not instance of Canvas');
      }

      if (options.rotate) {
        canvas = rotateCanvas90Deg(canvas);
      }

      if (options.flipX || options.flipY) {
        canvas = flipCanvas(canvas, options.flipX, options.flipY);
      }

      // const imageDatas = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
      const imageDatas = await splitCanvasInImageDataChunks(canvas, options.width);

      return imageDatas.map(imageData => getBitRowsFromImageData(imageData));
    }
  }
};

</script>

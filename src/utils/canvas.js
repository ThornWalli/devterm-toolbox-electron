import { MAX_DOTS } from 'node-devterm/config';

export const toDataURL = (targetCanvas) => {
  const canvas = document.createElement('canvas');
  canvas.width = targetCanvas.width;
  canvas.height = targetCanvas.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(targetCanvas, 0, 0);
  console.log('update Canvas', canvas);
  return canvas.toDataURL();
};

export const resizeCanvas = (canvas, width) => {
  if (canvas.width <= width) {
    return canvas;
  }
  const height = width * (canvas.height / canvas.width);
  const resizedCanvas = new OffscreenCanvas(width, height);
  resizedCanvas.getContext('2d').drawImage(canvas, 0, 0, width, height);
  return resizedCanvas;
};

export const getCanvasFromUrl = async (dataUrl) => {
  const img = new global.Image();
  await new Promise(resolve => {
    img.onload = () => resolve(img);
    img.src = dataUrl;
    img.crossOrigin = 'anonymous';
  });
  const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return canvas;
};

export const preparePreview = (canvas, colors) => {
  canvas = resizeCanvas(canvas, MAX_DOTS);
  const ctx = canvas.getContext('2d');

  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  grayscale(imageData.data, colors);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};
const grayscale = (data, colors) => {
  for (let i = 0; i < data.length; i += 4) {
    const brightness = ((data[i] + data[i + 1] + data[i + 2]) / 3) / 255;
    if (brightness < 0.6) {
      data[i] = colors.primary[0];
      data[i + 1] = colors.primary[1];
      data[i + 2] = colors.primary[2];
    } else {
      data[i] = colors.secondary[0];
      data[i + 1] = colors.secondary[1];
      data[i + 2] = colors.secondary[2];
    }
  }
};

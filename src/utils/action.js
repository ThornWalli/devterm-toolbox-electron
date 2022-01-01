import { ALIGN, FONT } from 'node-devterm/config';

export const getDefaultImageOptions = () => {
  return {
    file: null,
    imageOptions: {
      grayscale: false,
      rotate: false,
      flipX: false,
      flipY: false,
      width: null
    }
  };
};
export const getDefaultQRCodeOptions = () => {
  return {
    text: 'Sample',
    options: {
      errorCorrectionLevel: 'M',
      margin: 0,
      scale: 4,
      small: false
    },
    imageOptions: {
      rotate: false,
      flipX: false,
      flipY: false,
      width: null
    }
  };
};

export const getDefaultBarcodeOptions = () => {
  return {
    text: 'Sample',
    options: {
      format: '',
      height: 100,
      font: 'monospace',
      textAlign: 'center',
      textPosition: 'bottom',
      textMargin: 2,
      fontSize: 20,
      margin: 10,
      displayValue: true,
      flat: false
    },
    imageOptions: {
      rotate: false,
      flipX: false,
      flipY: false,
      width: null
    }
  };
};

export const ACTION_DEFINITIONS = {
  cutLine: {
    display: () => ({
      title: 'Cut Line'
    }),
    printerCommand: (printer) => printer.addCutLine()
  },
  barcode: {
    display: (value) => ({
      title: 'Barcode',
      value: value.text
    }),
    printerCommand: (printer, value) => printer.writeBarcode(value.text, value.options, value.imageOptions)
  },
  qrCode: {
    display: (value) => ({
      title: 'QR Code',
      value: value.text
    }),
    printerCommand: (printer, value) => printer.writeQRCode(value.text, value.options, value.imageOptions)
  },
  text: {
    display: value => ({
      title: 'Text',
      value: `${value.slice(0, 16)}…`
    }),
    printerCommand: (printer, value) => printer.writeLine(value)
  },
  image: {
    display: () => ({
      title: 'Image'
    }),
    printerCommand: (printer, value) => printer.writeImage(value.file, value.imageOptions)
  },
  feedPitch: {
    display: ({ type, value }) => ({
      title: 'Feed-Pitch',
      value: `${type} | ${value}`
    }),
    printerCommand: (printer, { type, value }) => {
      if (type === 'pixel') {
        return printer.feedPitchByPixel(value);
      } else {
        return printer.feedPitchByFont(value);
      }
    }
  },
  reset: {
    display: value => ({
      property: true,
      title: 'Reset'
    }),
    printerCommand: (printer) => printer.reset()
  },
  setAlign: {
    display: value => ({
      property: true,
      title: 'Align',
      value: `${Object.entries(ALIGN).find(align => align[1] === value)[0]}`
    }),
    printerCommand: (printer, value) => printer.setAlign(value)
  },
  setFont: {
    display: value => ({
      property: true,
      title: 'Font',
      value: Object.entries(FONT).find((font) => Number(value) === font[1])[0]
    }),
    printerCommand: (printer, value) => printer.setFont(value)
  },
  setLineSpace: {
    display: (value) => ({
      property: true,
      title: 'Line-Space',
      value
    }),
    printerCommand: (printer, value) => printer.setLineSpace(value)
  },
  setWordGap: {
    display: value => ({
      property: true,
      title: 'Word-Gap',
      value
    }),
    printerCommand: (printer, value) => printer.setWordGap(value)
  },
  setMargin: {
    display: value => ({
      property: true,
      title: 'Margin',
      value
    }),
    printerCommand: (printer, value) => printer.setMargin(value)
  },
  setDensity: {
    display: value => ({
      property: true,
      title: 'Density',
      value
    }),
    printerCommand: (printer, value) => printer.setDensity(value)
  }
};

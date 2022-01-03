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
    })
  },
  barcode: {
    display: (value) => ({
      title: 'Barcode',
      value: value.text
    })
  },
  qrCode: {
    display: (value) => ({
      title: 'QR Code',
      value: value.text
    })
  },
  text: {
    display: value => ({
      title: 'Text',
      value: `${value.slice(0, 16)}…`
    })
  },
  image: {
    display: () => ({
      title: 'Image'
    })
  },
  feedPitch: {
    display: ({ type, value }) => ({
      title: 'Feed-Pitch',
      value: `${type} | ${value}`
    })
  },
  reset: {
    display: value => ({
      property: true,
      title: 'Reset'
    })
  },
  setAlign: {
    display: value => ({
      property: true,
      title: 'Align',
      value: `${Object.entries(ALIGN).find(align => align[1] === value)[0]}`
    })
  },
  setFont: {
    display: value => ({
      property: true,
      title: 'Font',
      value: Object.entries(FONT).find((font) => Number(value) === font[1])[0]
    })
  },
  setLineSpace: {
    display: (value) => ({
      property: true,
      title: 'Line-Space',
      value
    })
  },
  setWordGap: {
    display: value => ({
      property: true,
      title: 'Word-Gap',
      value
    })
  },
  setMargin: {
    display: value => ({
      property: true,
      title: 'Margin',
      value
    })
  },
  setDensity: {
    display: value => ({
      property: true,
      title: 'Density',
      value
    })
  }
};


import { v4 as uuidv4 } from 'uuid';

import { ALIGN, DEFAULT_DENSITY, FONT, getDefaultConfig, MAX_PIXELS_FONT } from 'node-devterm/config';
import ActionSetAlign from '@/components/controls/actions/SetAlign';
import ActionSetFont from '@/components/controls/actions/SetFont';
import ActionSetMargin from '@/components/controls/actions/SetMargin';
import ActionSetLineSpace from '@/components/controls/actions/SetLineSpace';
import ActionSetWordGap from '@/components/controls/actions/SetWordGap';
import ActionSetDensity from '@/components/controls/actions/SetDensity';
import ActionText from '@/components/controls/actions/Text';
import ActionImage from '@/components/controls/actions/Image';
import ActionQrCode from '@/components/controls/actions/QrCode';
import ActionFeedPitch from '@/components/controls/actions/FeedPitch';
import PreviewTextCanvas from '@/components/preview/TextCanvas';
import PreviewImageCanvas from '@/components/preview/ImageCanvas';
import PreviewQrCodeCanvas from '@/components/preview/QrCodeCanvas';
import PreviewBarcodeCanvas from '@/components/preview/BarcodeCanvas';
import PreviewFeedPitch from '@/components/preview/FeedPitch';
import { DropDownOptionDescription } from '@/components/base/DropDown';

export const getActionTypeOptions = () => {
  return [
    new DropDownOptionDescription({ title: 'Add new Action…', value: '' }),
    new DropDownOptionDescription({ title: 'Set Margin', value: 'setMargin' }),
    new DropDownOptionDescription({ title: 'Set Font', value: 'setFont' }),
    new DropDownOptionDescription({ title: 'Set Align', value: 'setAlign' }),
    new DropDownOptionDescription({ title: 'Set Density', value: 'setDensity' }),
    new DropDownOptionDescription({ title: 'Set LineSpace', value: 'setLineSpace' }),
    new DropDownOptionDescription({ title: 'Set WordGap', value: 'setWordGap' }),
    new DropDownOptionDescription({ title: 'Reset', value: 'reset' }),
    new DropDownOptionDescription({ title: 'Image', value: 'image' }),
    new DropDownOptionDescription({ title: 'QRCode', value: 'qrCode' }),
    new DropDownOptionDescription({ title: 'Barcode', value: 'barcode' }),
    new DropDownOptionDescription({ title: 'Text', value: 'text' }),
    new DropDownOptionDescription({ title: 'Cutline', value: 'cutLine' })
  ];
}; console.log('DEFAULT_DENSITY', DEFAULT_DENSITY);

export const getComponentByType = (type) => {
  return {
    setMargin: ActionSetMargin,
    setAlign: ActionSetAlign,
    setFont: ActionSetFont,
    setDensity: ActionSetDensity,
    text: ActionText,
    image: ActionImage,
    qrCode: ActionQrCode,
    setLineSpace: ActionSetLineSpace,
    setWordGap: ActionSetWordGap,
    feedPitch: ActionFeedPitch
  }[type];
};

export class ActionDescription {
  constructor (options) {
    const { type, value } = options || {};
    this.id = uuidv4();
    this.type = type;
    this.value = value;
    // this.timestamp = timestamp || Date.now();
  }

  toJSON () {
    return {
      id: this.id,
      type: this.type,
      value: this.value
    };
  }
}

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

/**
 * Create Action Description with default value
 * @param String type
 * @returns ActionDescription
 */
export const createAction = (type) => {
  let value;
  switch (type) {
    case 'setLineSpace':
      value = 0;
      break;
    case 'setWordGap':
      value = 0;
      break;
    case 'setMargin':
      value = 0;
      break;
    case 'setFont':
      value = FONT.SIZE_8_16_THIN_1;
      break;
    case 'setAlign':
      value = ALIGN.LEFT;
      break;
    case 'text':
      value = 'Text';
      break;
    case 'image':
      value = getDefaultImageOptions();
      break;
    case 'qrCode':
      value = getDefaultQRCodeOptions();
      break;
    case 'barcode':
      value = getDefaultBarcodeOptions();
      break;
    default:
      break;
  }
  return new ActionDescription({ type, value });
};

export const executeActions = (actions) => {
  const options = getDefaultConfig();
  return actions.map(action => executeAction(action, options)).filter(Boolean);
};

const getCutLine = (font) => {
  return Array(MAX_PIXELS_FONT[font]).fill('').map((v, i) => {
    if (i % 2 === 0) {
      return '=';
    } else {
      return '-';
    }
  }).join('');
};

export const executeAction = (action, options) => {
  switch (action.type) {
    case 'setMargin':
      options.margin = action.value;
      break;

    case 'setAlign':
      options.align = action.value;
      break;

    case 'setLineSpace':
      options.lineSpace = action.value;
      break;

    case 'setWordGap':
      options.wordGap = action.value;
      break;

    case 'setFont':
      options.font = Number(action.value);
      break;

    case 'setDensity':
      options.density = Number(action.value);
      break;

    case 'reset':
      Object.assign(options, getDefaultConfig());
      break;

    case 'cutLine':
      return {
        id: action.id,
        component: PreviewTextCanvas,
        options: {
          ...options,
          // reset options
          margin: 0,
          wordGap: 0,
          lineSpace: 0,
          density: DEFAULT_DENSITY
        },
        props: {
          value: getCutLine(options.font)
        }
      };

    case 'barcode':
      return {
        id: action.id,
        component: PreviewBarcodeCanvas,
        options: { ...options },
        props: { ...action }
      };

    case 'qrCode':
      return {
        id: action.id,
        component: PreviewQrCodeCanvas,
        options: { ...options },
        props: { ...action }
      };

    case 'image':
      return {
        id: action.id,
        component: PreviewImageCanvas,
        options: { ...options },
        props: { ...action }
      };

    case 'text':
      return {
        id: action.id,
        component: PreviewTextCanvas,
        options: { ...options },
        props: { ...action }
      };

    case 'feedPitch':
      return {
        id: action.id,
        component: PreviewFeedPitch,
        options: { ...options },
        props: { ...action.value }
      };
  }
  return null;
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
    dialog: () => import('@/components/controls/actions/Barcode'),
    printerCommand: (printer, value) => printer.writeBarcode(value.text, value.options, value.imageOptions)
  },
  qrCode: {
    display: (value) => ({
      title: 'QR Code',
      value: value.text
    }),
    dialog: () => import('@/components/controls/actions/QrCode'),
    printerCommand: (printer, value) => printer.writeQRCode(value.text, value.options, value.imageOptions)
  },
  text: {
    display: value => ({
      title: 'Text',
      value: `${value.slice(0, 16)}…`
    }),
    dialog: () => import('@/components/controls/actions/Text'),
    printerCommand: (printer, value) => printer.writeLine(value)
  },
  image: {
    display: () => ({
      title: 'Image'
    }),
    dialog: () => import('@/components/controls/actions/Image'),
    printerCommand: (printer, value) => printer.writeImage(value.file, value.imageOptions)
  },
  feedPitch: {
    display: ({ type, value }) => ({
      title: 'Feed-Pitch',
      value: `${type} | ${value}`
    }),
    dialog: () => import('@/components/controls/actions/FeedPitch'),
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
    dialog: () => import('@/components/controls/actions/SetAlign'),
    printerCommand: (printer, value) => printer.setAlign(value)
  },
  setFont: {
    display: value => ({
      property: true,
      title: 'Font',
      value: Object.entries(FONT).find((font) => Number(value) === font[1])[0]
    }),
    dialog: () => import('@/components/controls/actions/SetFont'),
    printerCommand: (printer, value) => printer.setFont(value)
  },
  setLineSpace: {
    display: (value) => ({
      property: true,
      title: 'Line-Space',
      value
    }),
    dialog: () => import('@/components/controls/actions/SetLineSpace'),
    printerCommand: (printer, value) => printer.setLineSpace(value)
  },
  setWordGap: {
    display: value => ({
      property: true,
      title: 'Word-Gap',
      value
    }),
    dialog: () => import('@/components/controls/actions/SetWordGap'),
    printerCommand: (printer, value) => printer.setWordGap(value)
  },
  setMargin: {
    display: value => ({
      property: true,
      title: 'Margin',
      value
    }),
    dialog: () => import('@/components/controls/actions/SetMargin'),
    printerCommand: (printer, value) => printer.setMargin(value)
  },
  setDensity: {
    display: value => ({
      property: true,
      title: 'Density',
      value
    }),
    dialog: () => import('@/components/controls/actions/SetDensity'),
    printerCommand: (printer, value) => printer.setDensity(value)
  }
};

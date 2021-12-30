
import { v4 as uuidv4 } from 'uuid';

import { ALIGN, DEFAULT_DENSITY, FONT, getDefaultConfig, MAX_PIXELS_FONT } from 'node-devterm/config';
import ActionSetAlign from '@/components/controls/actions/SetAlign';
import ActionSetFont from '@/components/controls/actions/SetFont';
import ActionSetMargin from '@/components/controls/actions/SetMargin';
import ActionCutLine from '@/components/controls/actions/CutLine';
import ActionSetLineSpace from '@/components/controls/actions/SetLineSpace';
import ActionSetWordGap from '@/components/controls/actions/SetWordGap';
import ActionSetDensity from '@/components/controls/actions/SetDensity';
import ActionReset from '@/components/controls/actions/Reset';
import ActionText from '@/components/controls/actions/Text';
import ActionImage from '@/components/controls/actions/Image';
import ActionFeedPitch from '@/components/controls/actions/FeedPitch';
import PreviewTextCanvas from '@/components/preview/TextCanvas';
import PreviewImageCanvas from '@/components/preview/ImageCanvas';
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
    new DropDownOptionDescription({ title: 'Text', value: 'text' }),
    new DropDownOptionDescription({ title: 'Cutline', value: 'cutLine' })
  ];
};

export const getComponentByType = (type) => {
  return {
    setMargin: ActionSetMargin,
    setAlign: ActionSetAlign,
    setFont: ActionSetFont,
    setDensity: ActionSetDensity,
    text: ActionText,
    image: ActionImage,
    reset: ActionReset,
    cutLine: ActionCutLine,
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
  }

  toJSON () {
    return {
      id: this.id,
      type: this.type,
      value: this.value
    };
  }
}

export const createAction = (type) => {
  let value;
  switch (type) {
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
    default:
      break;
  }
  return new ActionDescription({ type, value });
};

export const executeActions = (actions, colors) => {
  const options = getDefaultConfig();
  return actions.map(action => executeAction(action, options, colors)).filter(Boolean);
};

export const executeAction = (action, options, colors) => {
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
        options: { ...options, margin: 0, wordGap: 0, lineSpace: 0, density: DEFAULT_DENSITY },
        props: {
          value: Array(MAX_PIXELS_FONT[options.font]).fill('').map((v, i) => {
            if (i % 2 === 0) {
              return '=';
            } else {
              return '-';
            }
          }).join(''),

          colors
        }
      };
    case 'image':
      console.log({
        id: action.id,
        component: PreviewImageCanvas,
        options: { ...options },
        props: { ...action, colors }
      });
      return {
        id: action.id,
        component: PreviewImageCanvas,
        options: { ...options },
        props: { ...action, colors }
      };
    case 'text':
      return {
        id: action.id,
        component: PreviewTextCanvas,
        options: { ...options },
        props: { ...action, colors }
      };

    case 'feedPitch':
      return {
        id: action.id,
        component: PreviewFeedPitch,
        options: { ...options },
        props: { ...action.value }
      };
  } return null;
};

export default {
  barcode: () => import('@/components/controls/actions/Barcode.vue'),
  qrCode: () => import('@/components/controls/actions/QrCode.vue'),
  text: () => import('@/components/controls/actions/Text.vue'),
  image: () => import('@/components/controls/actions/Image.vue'),
  feedPitch: () => import('@/components/controls/actions/FeedPitch.vue'),
  setAlign: () => import('@/components/controls/actions/SetAlign.vue'),
  setFont: () => import('@/components/controls/actions/SetFont.vue'),
  setLineSpace: () => import('@/components/controls/actions/SetLineSpace.vue'),
  setWordGap: () => import('@/components/controls/actions/SetWordGap.vue'),
  setMargin: () => import('@/components/controls/actions/SetMargin.vue'),
  setDensity: () => import('@/components/controls/actions/SetDensity.vue')
};

<template>
  <controls-action-item class="action-cut-line" :title="title" v-bind="$attrs" v-on="$listeners">
    <template #head>
      <slot name="head" />
    </template>
  </controls-action-item>
</template>

<script>
import ControlsActionItem from '@/components/controls/ActionItem';
export default {
  components: { ControlsActionItem },
  inheritAttrs: false,
  data () {
    return {
      title: 'CutLine'
    };
  }
};
</script>

<style lang="postcss" scoped>
.action-cut-line {
  /* empty */
}
</style>

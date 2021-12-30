<template>
  <controls-action-item class="action-reset" :title="title" v-bind="$attrs" v-on="$listeners">
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
      title: 'Reset'
    };
  }
};
</script>

<style lang="postcss" scoped>
.action-reset {
  /* empty */
}
</style>

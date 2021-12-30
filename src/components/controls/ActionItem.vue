<template>
  <div class="controls-action-item" :class="{'focus':focus || active, 'can-open': $slots.default }" focusable v-on="$listeners">
    <div class="head">
      <div class="title" @click="onClick">
        <span>{{ title }}</span>
      </div>
      <div v-if="$slots.head">
        <slot name="head" />
      </div>
    </div>
    <div v-if="active" class="content">
      <span @click="$emit('active', false)" />
      <div>
        <slot />
        <div class="buttons">
          <input-text-button color="primary" text="Close" @click="$emit('active', false)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputTextButton from '@/components/inputs/TextButton';
export default {
  components: { InputTextButton },

  props: {
    itemStates: {
      type: Object,
      default () {
        return { id: false };
      }
    },
    id: {
      type: String,
      default: 'id'
    },
    focus: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Action Item'
    }
  },
  data () {
    return {
      // active: false
    };
  },
  computed: {
    active () {
      return this.itemStates[this.id];
    }
  },
  methods: {

    onClick () {
      if (this.$slots.default) {
        this.$emit('active', true);
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.controls-action-item {
  display: block;
  opacity: 0.6;

  &:hover,
  &:focus {
    opacity: 1;
  }

  & > .head {
    display: flex;
    align-items: center;

    & .title {
      display: block;
      flex: 1;
      padding: 0 calc(4 / 12 * 1em);
      font-size: calc(12 / 16 * 1em);
    }
  }

  &.can-open {
    & > .head {
      & .title {
        cursor: pointer;
      }
    }
  }

  &.focus {
    & > .head {
      color: var(--color-secondary);
      background: var(--color-primary);
    }

    opacity: 1;
  }

  & > .content {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;

    & > span {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgb(0 0 0 / 50%);
    }

    & > div {
      position: relative;
      box-sizing: border-box;
      width: 80%;
      padding: calc(8 / 16 * 1em);
      padding-top: calc(8 / 16 * 1em);
      margin-top: calc(8 / 16 * 1em);
      background: black;
      border: solid var(--color-primary) 1px;
    }
  }

  & .buttons {
    margin: calc(-8 / 16 * 1em);
    margin-top: calc(8 / 16 * 1em);

    & > * {
      width: 100%;
    }
  }
}
</style>

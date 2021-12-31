<template>
  <dialog class="app-dialog" :class="{embed}">
    <div>
      <slot>Dialog Content</slot>
      <div v-if="$slots.buttons" class="buttons">
        <slot name="buttons" />
      </div>
    </div>
  </dialog>
</template>

<script>
// import { filter } from 'rxjs/operators';
// import { keyUpObserver } from '@/utils/dom';
export default {
  props: {
    embed: {
      type: Boolean,
      default: false
    },
    escapeClose: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      open: false,
      subscriptions: []
    };
  },
  watch: {
    open (value) {
      if (value) {
        // this.subscriptions = [keyUpObserver.pipe(filter(({ key }) => key === 'Escape')).subscribe((e) => {
        //   if (this.escapeClose) {
        //     this.close();
        //   }
        // })];
        this.$emit('open');
      } else {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
        this.$emit('close');
      }
    }
  },
  mounted () {
    this.$emit('ready');
  },
  destroyed () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  },
  methods: {
    show () {
      this.open = true;
      if (this.embed) {
        this.$el.show();
      } else {
        this.$el.showModal();
      }
    },
    close () {
      this.open = false;
      this.$el.close();
    }
  }
};
</script>

<style lang="postcss" scoped>
.app-dialog {
  display: none;
  padding: 0;
  background: transparent;
  border: none;
  appearance: none;

  &[open] {
    &:not(.embed) {
      display: block;
    }

    &.embed {
      display: flex;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: "";
        background: rgb(0 0 0 / 50%);
      }
    }
  }

  /* empty */
  &::backdrop {
    background: rgb(0 0 0 / 80%);
  }

  & > div {
    position: relative;
    box-sizing: border-box;
    padding: calc(8 / 16 * 1em);
    padding-top: calc(8 / 16 * 1em);
    margin-top: calc(8 / 16 * 1em);
    color: var(--color-primary);
    background: black;
    border: solid var(--color-primary) 1px;
  }

  & .buttons {
    margin: calc(-8 / 16 * 1em);
    margin-top: calc(8 / 16 * 1em);

    & > * {
      width: 100%;
    }
  }

  &:not(.embed) {
    width: 80%;
  }

  &.embed {
    position: absolute;
    top: 0;
    right: 0;
    left: auto;
    z-index: 10;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;

    & > div {
      width: 80%;
    }
  }
}
</style>

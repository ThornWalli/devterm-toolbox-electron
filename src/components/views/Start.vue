<template>
  <app-view class="view-log">
    <div>
      <h2>Welcome DevTerm User!</h2>
      <p>
        Do you work local or remote?
        <br>
        <br>
        <input-check-box v-model="remember" label="Remember choice" delimiter="?" />
      </p>

      <div class="buttons">
        <input-text-button color="primary" text="Use Local" @click="onClickLocal" />
        <input-text-button color="primary" text="Use Remote" @click="onClickRemote" />
      </div>
    </div>
  </app-view>
</template>

<script>
import AppView from '@/components/app/View';
import InputTextButton from '@/components/inputs/TextButton';
import InputCheckBox from '@/components/inputs/CheckBox';
export default {
  components: {
    AppView,
    InputTextButton,
    InputCheckBox
  },
  data () {
    return { remember: false };
  },
  methods: {
    onClickLocal () {
      this.$emit('apply', {
        remember: this.remember,
        type: 'local'
      });
    },
    onClickRemote () {
      this.$emit('apply', {
        remember: this.remember,
        type: 'remote'
      });
    }
  }
};
</script>

<style lang="postcss" scoped>
.view-log {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>

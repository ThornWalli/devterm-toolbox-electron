<template>
  <div class="text-editor">
    <span>Text:</span>
    <textarea :value="value" @input="$emit('input', $event.target.value)" />
    <div>
      <span>Rows: <span>{{ value.count }}</span></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="postcss" scoped>
.text-editor {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0.5em;
  background: #f4f7f3;

  & > div {
    font-size: calc(12 / 16 * 1em);

    & > span {
      /* empty */
    }
  }

  & > span {
    margin-bottom: 0.5em;
    font-size: calc(12 / 16 * 1em);
    font-weight: bold;
    color: rgb(0 0 0 / 60%);
    text-transform: uppercase;
  }
}

textarea {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  font-size: 1em;
  color: rgb(0 0 0 / 60%);
  resize: none;
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
}
</style>

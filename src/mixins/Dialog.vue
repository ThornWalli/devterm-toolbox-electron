<script>
export default {
  methods: {
    show (...args) {
      return this.$children[0].show(...args);
    },
    close (...args) {
      return this.$parent.close(...args);
    }
  }
};
</script>

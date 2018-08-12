<template>
  <div>
    <h3>Step {{step}}</h3>

    Step3
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Step3',
  data() {
    return {};
  },
  computed: {
    step() {
      return this.$route.params.step || 1;
    }
  },
  methods: {},
  created() {}
};
</script>

<style scoped lang="scss">
</style>

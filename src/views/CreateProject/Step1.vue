<template>
  <div class="step">

    <div class="step__team">
        Pick users
    </div>
    <div class="step__user">
        Pick a team
    </div>


  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Step1',
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
.step {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
  &__team,
  &__user {
    padding: 20px;
    border-radius: 10px;
    background-color: #eee;
    text-align: center;
  }
  &__team {
  }
  &__user {
  }
}
</style>

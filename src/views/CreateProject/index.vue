<template>
  <div class="wrapper">
    <h3>Step {{currentStep}}</h3>

    <component :is="`Step${currentStep}`" :next="next" :prev="prev" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import Step1 from '@/views/CreateProject/Step1.vue';
import Step2 from '@/views/CreateProject/Step2.vue';

const stepComponents = require.context('./', true, /Step(\d).vue$/);

export default {
  name: 'create-project',
  components: {
    ...stepComponents.keys().reduce((before, data) => {
      const mod = stepComponents(data);

      return {
        ...before,
        [mod.default.name]: mod.default
      };
    }, {})
  },
  data() {
    return {
      isColorPickerOpen: false,
      inputColor: '#ffffff',
      localUsers: [],
      localProject: {
        name: '',
        dateStart: '',
        dateEnd: '',
        type: 'USER'
      },
      localProjects: [],
      currentStep: 1
    };
  },
  computed: {
    maxSteps() {
      return stepComponents.keys().length;
    },
    hasLessSteps() {
      return this.currentStep > 1;
    },
    hasMoreSteps() {
      return this.currentStep < this.maxSteps;
    }
  },
  methods: {
    next() {
      if (this.hasMoreSteps) {
        this.currentStep += 1;
      }
    },
    prev() {
      if (this.hasLessSteps) {
        this.currentStep -= 1;
      }
    }
  },
  watch: {
    step(step) {
      if (this.currentStep !== step) {
        this.$router.push(`/project/create/${step}`);
      }
    }
  },
  created() {
    this.currentStep = parseInt(this.$route.params.step) || 1;
  }
};
</script>

<style scoped lang="scss">
</style>

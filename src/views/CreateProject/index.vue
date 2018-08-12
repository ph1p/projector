<template>
  <div class="wrapper">
    <h3>Step {{step}}</h3>

    <component :is="`Step${step}`" />

    <div class="btn-group">
      <Button v-if="step > 1" :to="`/project/create/${step - 1}`" type="normal">{{$t('back')}}</Button>
      <Button v-if="step < maxSteps" :to="`/project/create/${step + 1}`" type="normal">{{$t('next')}}</Button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import Button from '@/components/layout/Button.vue';

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
    }, {}),
    Button
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
      localProjects: []
    };
  },
  computed: {
    step() {
      return parseInt(this.$route.params.step) || 1;
    },
    maxSteps() {
      return stepComponents.keys().length;
    }
  }
};
</script>

<style scoped lang="scss">
</style>

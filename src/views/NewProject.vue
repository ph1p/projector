<template>
  <div class="wrapper">
    <h3>{{ $t('project.new') }}</h3>

    <div class="form" v-if="localProject">
      <div class="form-field">
        <strong>{{ $t('project.name') }}:</strong> <input v-model="localProject.name" type="text" />
      </div>

      <div class="form-field">
        <strong>{{ $t('from') }}:</strong> <datepicker v-model="localProject.dateStart"></datepicker>
      </div>

      <div class="form-field">
        <strong>{{ $t('to') }}:</strong> <datepicker v-model="localProject.dateEnd"></datepicker>
      </div>

      <div class="form-field">
        <strong>{{ $t('color') }}:</strong>
        <div class="color">
          <div
            class="color__preview"
            :style="{ backgroundColor: localProject.color }"
            @click="isColorPickerOpen = !isColorPickerOpen"
          ></div>
          <color-picker class="color__picker" v-if="isColorPickerOpen" v-model="inputColor"></color-picker>
        </div>
      </div>
    </div>

    <div class="user-lists"><UserList :project="localProject" :users="localUsers" :clickUser="clickUser" /></div>

    <h3 v-if="checkedUsers.length">Wer ist dabei?</h3>
    <UnitList :users="checkedUsers" />

    <div :class="isProjectValid && 'btn-group'">
      <button to="/" type="normal">{{ $t('back') }}</button>
      <button v-if="isProjectValid" @click.native="addProject" type="success">{{ $t('project.add') }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { Sketch } from 'vue-color';

import UnitList from '@/components/UnitList.vue';
import Button from '@/components/layout/Button.vue';
import UserList from '@/components/UserList.vue';

export default {
  name: 'new-project',
  data() {
    return {
      isColorPickerOpen: false,
      inputColor: '#ffffff',
      localUsers: [],
      localProject: {
        name: '',
        dateStart: '',
        dateEnd: ''
      },
      localProjects: []
    };
  },
  watch: {
    inputColor(value) {
      this.localProject.color = value.hex;
    }
  },
  components: {
    'color-picker': Sketch,
    Datepicker,
    UnitList,
    UserList,
    Button
  },
  computed: {
    ...mapGetters('settings', ['maxConcurrentProjectsPerUser']),
    ...mapGetters('projects', ['projects']),
    isProjectValid() {
      return (
        this.localProject.name !== '' &&
        this.localProject.dateStart !== '' &&
        this.localProject.dateEnd !== '' &&
        this.checkedUsers.length > 0 &&
        this.isDateSpanValid
      );
    },
    isDateSpanValid() {
      return moment(this.localProject.dateEnd).diff(moment(this.localProject.dateStart)) > 0;
    },
    checkedUserIds() {
      return this.localUsers.filter(user => user.isChecked).map(user => user.id);
    },
    checkedUsers() {
      return this.checkedUserIds.map(id => this.findUserById(id));
    }
  },
  methods: {
    ...mapMutations('projects', ['add']),
    addProject() {
      this.add({
        ...this.localProject,
        users: this.checkedUserIds
      });

      this.$snotify.success(this.$t('notifications.project-created'));
      this.$router.push('/');
    },
    clickUser({ id, maxConcurrentProjects }) {
      const user = this.localUsers.filter(user => user.id === id)[0];

      if (maxConcurrentProjects < this.maxConcurrentProjectsPerUser || user.isChecked || !maxConcurrentProjects) {
        user.isChecked = !user.isChecked;
      } else {
        this.$snotify.error(this.$t('notifications.to-many-projects'));
      }
    },
    usersInUnit(unitIds) {
      return this.localUsers.filter(
        user => this.globalData.units.filter(() => unitIds.indexOf(user.unit.id) !== -1)[0]
      );
    }
  },
  created() {
    this.localProject.color = this.getRandomColor;
    this.localUsers = orderBy(this.globalData.users, 'unit.name', 'asc').map(user => ({
      ...user,
      isChecked: false
    }));
  }
};
</script>

<style scoped lang="scss">
.user-lists {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
}
</style>

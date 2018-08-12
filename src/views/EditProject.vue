<template>
  <div class="wrapper">
    <div class="home" v-if="storeProject">
      <h3>{{$t('project.edit-with-name', { name: project.name })}}</h3>

      <div class="form">

        <div class="form-field">
          <strong>{{$t('project.name')}}:</strong>
          <input v-model="project.name" type="text">
        </div>

        <div class="form-field">
          <strong>{{$t('from')}}:</strong>
          <datepicker v-model="project.dateStart"></datepicker>
        </div>

        <div class="form-field">
          <strong>{{$t('to')}}:</strong>
          <datepicker v-model="project.dateEnd"></datepicker>
        </div>

        <div class="form-field">
          <strong>{{$t('color')}}:</strong>
          <div class="color">
            <div class="color__preview" :style="{backgroundColor: project.color}" @click="isColorPickerOpen = !isColorPickerOpen;"></div>
            <color-picker class="color__picker" v-if="isColorPickerOpen" v-model="inputColor"></color-picker>
          </div>
        </div>
      </div>

      <div class="user-lists">
        <UserList
          :project="project"
          :users="users"
          :clickUser="clickUser"
        />
      </div>

      <hr>

      <h3 v-if="checkedUsers.length">{{$t('project.who-is-there')}}</h3>
      <UnitList :users="checkedUsers" />
      <hr>
      <Gantt :date="project.dateStart" :highlightProject="currentProjectId" :users="checkedUsers" />

      <div class="btn-group">
        <Button to="/" type="normal">{{$t('back')}}</Button>
        <Button @click.native="updateProject" type="success">{{$t('save')}}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { Sketch } from 'vue-color';

import Button from '@/components/layout/Button.vue';
import UserList from '@/components/UserList.vue';
import UnitList from '@/components/UnitList.vue';
import Gantt from '@/components/Gantt.vue';

import data from '@/data';

export default {
  name: 'edit-project',
  data() {
    return {
      isColorPickerOpen: false,
      inputColor: '#ffffff',
      storeProject: {},
      project: {},
      users: []
    };
  },
  watch: {
    '$route.params.id': 'init',
    inputColor(value) {
      this.project.color = value.hex;
    }
  },
  components: {
    'color-picker': Sketch,
    Datepicker,
    Button,
    UserList,
    UnitList,
    Gantt
  },
  computed: {
    ...mapGetters('projects', ['projects', 'projectById']),
    ...mapGetters('settings', ['maxConcurrentProjectsPerUser']),
    checkedUserIds() {
      return this.users.filter(user => user.isChecked).map(user => user.id);
    },
    checkedUsers() {
      return this.checkedUserIds.map(id => this.findUserById(id));
    },
    currentProjectId() {
      return parseInt(this.$route.params.id, 0);
    }
  },
  methods: {
    ...mapMutations('projects', ['update']),
    init() {
      this.users = this.globalData.users;
      this.storeProject = this.projectById(this.$route.params.id);

      if (this.storeProject) {
        this.users = this.users.map(user => {
          return {
            ...user,
            isChecked: this.storeProject.users.filter(id => id === user.id).length > 0
          };
        });

        this.project = {
          ...this.storeProject,
          users: this.checkedUserIds
        };
      } else {
        this.$router.replace('/');
      }
    },
    updateProject() {
      this.update({
        ...this.project,
        users: this.checkedUserIds
      });
      this.storeProject = this.projectById(this.$route.params.id);
      this.$snotify.success(this.$t('notifications.project-edited'));
    },
    clickUser({ id, maxConcurrentProjects }) {
      const user = this.users.filter(user => user.id === id)[0];

      if (maxConcurrentProjects < this.maxConcurrentProjectsPerUser || user.isChecked || !maxConcurrentProjects) {
        user.isChecked = !user.isChecked;
      } else {
        this.$snotify.error(this.$t('notifications.to-many-projects'));
      }
    },
    usersInUnit(unitIds) {
      return this.users
        ? this.users.filter(user => this.globalData.units.filter(() => unitIds.indexOf(user.unit.id) !== -1)[0])
        : [];
    }
  },
  created() {
    this.init();
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

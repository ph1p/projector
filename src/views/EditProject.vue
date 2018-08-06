<template>
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
      <div>
        <h3>PM-Team</h3>
        <UserList :users="usersInUnit([5])"
          :toggleChecked="toggleChecked"
        />
      </div>
      <div>
        <h3>Dev-Team</h3>
        <UserList :users="usersInUnit([1,2,3,4,6])"
          :toggleChecked="toggleChecked"
        />
      </div>
    </div>

    <hr>

    <h3 v-if="checkedUsers.length">{{$t('project.who-is-there')}}</h3>
    <UnitList :users="checkedUsers" />

    <hr>
    <Gantt :date="project.dateStart" :highlightProject="currentProjectId" :users="storeProject.users" />

    <div class="btn-group">
      <Button to="/" type="normal">{{$t('back')}}</Button>
      <Button @click.native="update" type="success">{{$t('save')}}</Button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
    ...mapGetters(['projects', 'projectById', 'maxConcurrentProjectsPerUser']),
    checkedUsers() {
      return this.users.filter(user => user.isChecked);
    },
    currentProjectId() {
      return parseInt(this.$route.params.id, 0);
    }
  },
  watch: {
    '$route.params.id': 'init'
  },
  methods: {
    ...mapActions(['updateProject']),
    init() {
      this.storeProject = this.projectById(this.$route.params.id);

      if (this.storeProject) {
        this.users = data.users.map(user => {
          return {
            ...user,
            isChecked: this.storeProject.users.filter(pUser => pUser.id === user.id).length > 0
          };
        });

        this.project = {
          ...this.storeProject,
          users: orderBy(this.checkedUsers, 'name', 'asc')
        };
      } else {
        this.$router.replace('/');
      }
    },
    update() {
      this.updateProject({
        ...this.project,
        users: this.checkedUsers
      });
      this.storeProject = this.projectById(this.$route.params.id);
      this.$snotify.success(this.$t('notifications.project-edited'));
    },
    findUserById(id) {
      return this.users.filter(user => user.id === id)[0];
    },
    toggleChecked(id, maxConcurrentProjects) {
      const user = this.findUserById(id);
      if (maxConcurrentProjects < this.maxConcurrentProjectsPerUser || user.isChecked) {
        user.isChecked = !user.isChecked;
      } else {
        this.$snotify.error(this.$t('notifications.to-many-projects'));
      }
    },
    usersInUnit(unitIds) {
      return this.users
        ? this.users.filter(user => data.units.filter(() => unitIds.indexOf(user.unit.id) !== -1)[0])
        : [];
    }
  },
  created() {
    this.init();
  }
};
</script>

<style scoped lang="scss">
.btn-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
}
.user-lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
}
.form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 40px;
  grid-gap: 30px;
  .color {
    position: relative;
    border: 1px solid #999;
    border-radius: 100%;
    box-sizing: border-box;
    padding: 4px;
    display: inline-block;
    &__preview {
      border-radius: 100%;
      width: 25px;
      height: 25px;
    }
    &__picker {
      position: absolute;
      z-index: 5;
      top: 0px;
      right: 45px;
    }
  }
  .form-field {
    margin-bottom: 20px;
    input {
      width: 100%;
      font-size: 14px;
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 5px;
    }
    &:last-child {
      margin: 0;
    }
  }
}
</style>

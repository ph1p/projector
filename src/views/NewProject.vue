<template>
  <div class="home">
    <h3>{{$t('project.new')}}</h3>

    <div class="form" v-if="localProject">

      <div class="form-field">
        <strong>{{$t('project.name')}}:</strong>
        <input v-model="localProject.name" type="text">
      </div>

      <div class="form-field">
        <strong>{{$t('from')}}:</strong>
        <datepicker v-model="localProject.dateStart"></datepicker>
      </div>

      <div class="form-field">
        <strong>{{$t('to')}}:</strong>
        <datepicker v-model="localProject.dateEnd"></datepicker>
      </div>

      <div class="form-field">
        <strong>{{$t('color')}}:</strong>
        <div class="color">
          <div class="color__preview" :style="{backgroundColor: localProject.color}" @click="isColorPickerOpen = !isColorPickerOpen;"></div>
          <color-picker class="color__picker" v-if="isColorPickerOpen" v-model="inputColor"></color-picker>
        </div>
      </div>
    </div>

    <div class="user-lists">
      <div>
        <h3>PM-Team</h3>
        <UserList
          :users="usersInUnit([5])"
          :toggleChecked="toggleChecked"
        />
      </div>
      <div>
        <h3>Dev-Team</h3>
        <UserList
          :users="usersInUnit([1,2,3,4,6])"
          :toggleChecked="toggleChecked"
        />
      </div>
    </div>

    <h3 v-if="checkedUsers.length">Wer ist dabei?</h3>
    <UnitList :users="checkedUsers" />


    <div :class="isProjectValid && 'btn-group'">
      <Button to="/" type="normal">{{$t('back')}}</Button>
      <Button v-if="isProjectValid" @click.native="add" type="success">{{$t('project.add')}}</Button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { Sketch } from 'vue-color';

import UnitList from '@/components/UnitList.vue';
import Button from '@/components/layout/Button.vue';
import UserList from '@/components/UserList.vue';
import data from '@/data';

export default {
  name: 'new-project',
  data() {
    return {
      isColorPickerOpen: false,
      inputColor: '#ffffff',
      localProject: {
        name: '',
        dateStart: '',
        dateEnd: ''
      },
      localUsers: orderBy(data.users, 'unit.name', 'asc'),
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
    ...mapGetters(['projects', 'maxConcurrentProjectsPerUser']),
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
    checkedUsers() {
      return this.localUsers.filter(user => user.isChecked);
    }
  },
  methods: {
    ...mapActions(['addProject']),
    add() {
      this.addProject({
        ...this.localProject,
        users: this.checkedUsers
      });
      this.$snotify.success(this.$t('notifications.project-created'));
    },
    findUserById(id) {
      return this.localUsers.filter(user => user.id === id)[0] || {};
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
      return this.localUsers.filter(user => data.units.filter(() => unitIds.indexOf(user.unit.id) !== -1)[0]);
    }
  },
  created() {
    this.localProject.color = this.getRandomColor;
    this.localUsers = this.localUsers.map(user => ({
      ...user,
      isChecked: false
    }));
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

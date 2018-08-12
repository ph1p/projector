<template>
  <div class="presentation">
    <h3 v-if="unitUsers.length">{{$t('project.time-beam')}} ({{currentYear}})</h3>
    <Gantt
        :disableHeader="true"
        :date="startDate"
        :start="startUsers"
        :limit="userLimit"
        :showPagination="true"
        :users="unitUsers" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

import Gantt from '@/components/Gantt.vue';
import data from '@/data';

export default {
  name: 'home',
  data() {
    return {
      users: orderBy(data.users, 'unit.name', 'asc'),
      startUsers: 0,
      userLimit: 10
    };
  },
  components: {
    Gantt
  },
  computed: {
    ...mapGetters('projects', ['projects']),
    startDate() {
      return moment().format('DD.MM.YYYY');
    },
    currentYear() {
      return moment().format('YYYY');
    },
    unitUsers() {
      return this.usersInUnit([1, 2, 3, 4, 5, 6]);
    }
  },
  methods: {
    usersInUnit(unitIds) {
      return this.users.filter(user => data.units.filter(() => unitIds.indexOf(user.unit.id) !== -1)[0]);
    },
    setUserLimit() {
      if (this.startUsers + this.userLimit >= this.unitUsers.length) {
        this.startUsers = 0;
      } else {
        this.startUsers += this.userLimit;
      }
    }
  },
  destroyed() {
    clearInterval(this.setUserLimit);
  },
  created() {
    if (this.users && this.users.length > this.userLimit) {
      setInterval(this.setUserLimit, 5000);
    }
  }
};
</script>

<style scoped lang="scss">
.presentation {
  padding: 10px 30px 30px;
  background-color: #000;
  color: #fff !important;
  height: 100vh;
}
</style>

<style lang="scss" child-component="Gantt">
.gantt {
  border: 0 !important;
  color: #2c3e50;
  height: calc(100vh - 136px);
  grid-template-rows: 58px;
}
</style>
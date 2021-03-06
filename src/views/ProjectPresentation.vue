<template>
  <div class="presentation" v-if="storeProject">
    <h3>{{ $tc('project.self') }} "{{ project.name }}" ({{ startDate }} - {{ endDate }})</h3>

    <h3 v-if="checkedUsers.length">{{ $t('project.who-is-there') }}</h3>
    <UnitList :users="checkedUsers" />

    <h3 v-if="checkedUsers.length">{{ $t('project.time-beam') }}</h3>
    <Gantt
      class="overwrite_gantt"
      :disableHeader="true"
      :start="startUsers"
      :limit="userLimit"
      :showPagination="true"
      :date="project.dateStart"
      :highlightProject="currentProjectId"
      :users="checkedUsers"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

import Button from '@/components/layout/Button.vue';
import UnitList from '@/components/UnitList.vue';
import Gantt from '@/components/Gantt.vue';

import data from '@/data';

export default {
  name: 'project',
  data() {
    return {
      storeProject: {},
      project: {},
      users: [],
      startUsers: 0,
      userLimit: 10
    };
  },
  components: {
    Button,
    UnitList,
    Gantt
  },
  watch: {
    '$route.params.id': 'init'
  },
  computed: {
    ...mapGetters('projects', ['projects', 'projectById']),
    currentProjectId() {
      return parseInt(this.$route.params.id, 0);
    },
    startDate() {
      return moment(this.project.dateStart).format('DD.MM.YYYY');
    },
    endDate() {
      return moment(this.project.dateEnd).format('DD.MM.YYYY');
    },
    checkedUserIds() {
      return this.users.filter(user => user.isChecked).map(user => user.id);
    },
    checkedUsers() {
      return this.checkedUserIds.map(id => this.findUserById(id));
    }
  },
  methods: {
    init() {
      this.storeProject = this.projectById(this.$route.params.id);

      if (this.storeProject) {
        this.users = data.users.map(user => {
          return {
            ...user,
            isChecked: this.storeProject.users.filter(id => id === user.id) > 0
          };
        });

        this.project = {
          ...this.storeProject,
          users: orderBy(this.storeProject.users, 'name', 'asc')
        };

        if (this.storeProject.users && this.storeProject.users.length > this.userLimit) {
          setInterval(this.setUserLimit, 5000);
        }
      } else {
        this.$router.replace('/');
      }
    },
    setUserLimit() {
      if (this.startUsers + this.userLimit >= this.storeProject.length) {
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
    this.init();
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
  grid-template-rows: 58px;
}
</style>

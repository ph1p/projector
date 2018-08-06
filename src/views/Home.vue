<template>
  <div class="wrapper">
    <h3 v-if="projects.length">{{$tc('project.self', 2)}}</h3>

    <ul class="projects" v-if="projects.length">
      <router-link tag="li" :style="{borderColor: project.color}" :to="`/project/${project.id}`" v-for="(project, index) in projects" :key="project.name+index">
        <strong>{{project.id}}.) {{project.name}}</strong>
        <UnitList :users="project.users" />
      </router-link>
    </ul>
    <InfoMessage v-else :btnText="$t('project.new')" btnLink="/newProject" :text="$t('project.nothing')" />



    <h3 v-if="projects.length">{{$t('project.time-beam')}}</h3>
    <Gantt :users="usersInUnit([1,2,3,4,5,6])" />
    <hr />

    <h3 v-if="projects.length">{{$t('project.time-beam')}}</h3>
    <Gantt :users="usersInUnit([5])" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

import UnitList from '@/components/UnitList.vue';
import Gantt from '@/components/Gantt.vue';
import InfoMessage from '@/components/InfoMessage.vue';
import data from '@/data';

export default {
  name: 'home',
  data() {
    return {
      users: orderBy(data.users, 'unit.name', 'asc')
    };
  },
  components: {
    UnitList,
    Gantt,
    InfoMessage
  },
  computed: {
    ...mapGetters(['projects'])
  },
  methods: {
    usersInUnit(unitIds) {
      return this.users.filter(user => data.units.filter(() => unitIds.indexOf(user.unit.id) !== -1)[0]);
    }
  }
};
</script>

<style scoped lang="scss">
.projects {
  list-style: none;
  margin: 0 0 40px;
  padding: 0;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 350px;
  li {
    padding: 15px;
    margin: 0;
    cursor: pointer;
    border-width: 0 0 0 4px;
    border-style: solid;
    border-bottom: 1px solid #ddd !important;
    &:last-child {
      border-bottom: 0 !important;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>

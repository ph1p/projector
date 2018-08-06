<template>
  <div class="wrapper" v-if="storeProject">
    <h3>{{$tc('project.self')}} "{{project.name}}"</h3>

    <div class="form">
      <div class="form-field">
        <strong>{{$t('project.name')}}:</strong>
        {{project.name}}
      </div>

      <div class="form-field">
        <strong>{{$t('from')}}:</strong>
        {{startDate}}
      </div>

      <div class="form-field">
        <strong>{{$t('to')}}:</strong>
        {{endDate}}
      </div>

      <div class="form-field">
        <strong>{{$t('color')}}:</strong>
        <div class="color">
          <div class="color__preview" :style="{backgroundColor: project.color}"></div>
        </div>
      </div>
    </div>

    <hr />

    <h3 v-if="storeProject.users.length">{{$t('project.who-is-there')}}</h3>
    <UnitList :users="storeProject.users" />

    <hr />

    <h3 v-if="storeProject.users.length">{{$t('project.time-beam')}}</h3>
    <Gantt :date="project.dateStart" :highlightProject="currentProjectId" :users="storeProject.users" />

    <div class="btn-group">
      <Button to="/" type="normal">{{$t('back')}}</Button>
      <Button :to="`/presentation/${currentProjectId}`" type="dark">{{$t('presentation')}}</Button>
      <Button :to="`/project/edit/${currentProjectId}`" type="success">{{$t('edit')}}</Button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
      users: []
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
    ...mapGetters(['projects', 'projectById']),
    currentProjectId() {
      return parseInt(this.$route.params.id, 0);
    },
    startDate() {
      return moment(this.project.dateStart).format('DD.MM.YYYY');
    },
    endDate() {
      return moment(this.project.dateEnd).format('DD.MM.YYYY');
    }
  },
  methods: {
    init() {
      this.storeProject = this.projectById(this.$route.params.id);

      if (this.storeProject) {
        this.users = data.users.map(user => {
          return {
            ...user,
            isChecked: this.storeProject.users.filter(pUser => pUser.id === user.id) > 0
          };
        });

        this.project = {
          ...this.storeProject,
          users: orderBy(this.checkedUsers, 'name', 'asc')
        };
      } else {
        this.$router.replace('/');
      }
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
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
}
.form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 30px;
  .form-field {
    margin-bottom: 20px;
    .color {
      position: relative;
      border: 1px solid #999;
      border-radius: 100%;
      box-sizing: border-box;
      padding: 4px;
      margin: -10px 0 -12px 5px;
      display: inline-block;
      &__preview {
        border-radius: 100%;
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>

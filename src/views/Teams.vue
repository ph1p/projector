<template>
  <div class="wrapper">
    <h3>{{$tc('team.self', 2)}}</h3>

    <ul>
      <li v-for="team in teams" :key="team.name">
        {{team.id}} {{team.name}}

        <span @click="remove(team)">x</span>

        <div v-for="user in teamUsers(team)" :key="user.name">{{user.name}}</div>
      </li>
    </ul>

    <hr />
    <div class="form">
      <div class="form-field">
        <strong>{{$t('team.name')}}:</strong>
        <input name="name" v-model="team.name" type="text">

      </div>
    </div>

    <UserList :users="users" :clickUser="clickUser" />

    <div :class="'btn-group'">
      <Button to="/" type="normal">{{$t('back')}}</Button>
      <Button @click.native="add(team)" type="success">{{$t('team.add')}}</Button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

import Button from '@/components/layout/Button.vue';
import UserList from '@/components/UserList.vue';

export default {
  name: 'teams',
  data() {
    return {
      users: [],
      team: {
        name: '',
        users: []
      }
    };
  },
  components: {
    UserList,
    Button
  },
  watch: {
    '$route.params.id': 'init'
  },
  computed: {
    ...mapGetters('teams', ['teams'])
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations('teams', ['update', 'add', 'remove']),
    teamUsers(team) {
      return team.users.map(id => this.users.filter(user => user.id === id)[0])
    },
    clickUser({ id }) {
      const user = this.users.filter(user => user.id === id)[0] || {};

      user.isChecked = !user.isChecked;

      this.team.users = this.users.filter(user => user.isChecked).map(user => user.id);
    },
    init() {
      this.users = this.globalData.users;
    }
  }
};
</script>

<style scoped lang="scss">
</style>

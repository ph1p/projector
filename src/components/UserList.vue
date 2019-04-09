<template>
  <div class="users">
    <div class="header">
      <div class="user-search"><input type="text" :placeholder="`${$t('search')}...`" v-model="searchTerm" /></div>

      <div class="user-unit-select">
        <select name="blendingMode" v-model="selectedUnit" class="filter__blending-mode">
          <option value="" :selected="!selectedUnit">{{ $t('select-unit') }}</option>
          <option v-for="unit in units" :key="unit.name" :value="unit.id" :selected="unit.id === selectedUnit">{{
            unit.name
          }}</option>
        </select>
      </div>
    </div>

    <ul class="users-list">
      <li v-for="user in allUsers" :class="user.isChecked ? 'active' : ''" :key="user.name" @click="clickUser(user)">
        <div class="user">
          <div class="unit-identifier"><span :style="{ backgroundColor: user.unit.color }"></span></div>
          <div class="user-info">
            {{ user.name }}<span>{{ user.position.name }}</span>

            <div v-if="user.concurrentProjectsByProject">
              <div class="caution" v-if="user.concurrentProjectsByProject >= maxConcurrentProjectsPerUser">!</div>
              <p>{{ $t('project.amount-parallel', { amount: user.concurrentProjectsByProject }) }}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export default {
  name: 'UserList',
  data() {
    return {
      searchTerm: '',
      selectedUnit: ''
    };
  },
  props: {
    users: Array,
    clickUser: Function,
    project: Object
  },
  computed: {
    ...mapGetters('projects', ['projects', 'projectsByUser', 'maxConcurrentProjectsPerUser']),
    ...mapGetters('settings', ['maxConcurrentProjectsPerUser']),
    units() {
      return this.globalData.units;
    },
    startDate() {
      return this.project.dateStart ? moment(this.project.dateStart) : false;
    },
    endDate() {
      return this.project.dateEnd ? moment(this.project.dateEnd) : false;
    },
    allUsers() {
      return this.users
        .filter(user => user.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1)
        .filter(user => {
          if (this.selectedUnit) {
            if (this.selectedUnit === user.unit.id) {
              return user;
            }
          } else {
            return user;
          }
        })
        .map(user => {
          if (this.project) {
            const userProjects = this.projectsByUser(user);
            const concurrentProjectsByProject = userProjects.filter(project =>
              project.id !== this.project.id
                ? project.range.contains(this.startDate) || project.range.contains(this.endDate)
                : false
            ).length;

            if (concurrentProjectsByProject >= this.maxConcurrentProjectsPerUser) {
              user.isChecked = false;
            }

            return {
              ...user,
              concurrentProjectsByProject
            };
          }

          return user;
        });
    }
  }
};
</script>

<style scoped lang="scss">
.users {
  .header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    select {
      height: 100%;
    }
    .user-search,
    .user-unit-select {
      margin: 0 0 20px 0;
    }
  }
  &-list {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 300px;
    overflow: auto;
    border: 1px solid #ddd;
    border-radius: 5px;
    &.inline {
      height: auto;
      li {
        display: inline-block;
        padding: 0;
        .user {
          padding: 20px 0;
        }
      }
    }
    li {
      padding: 15px;
      margin: 0;
      cursor: pointer;
      position: relative;
      &:hover {
        background-color: #f5f5f5;
      }
      .caution {
        position: absolute;
        right: 15px;
        top: 10px;
        font-size: 35px;
        color: rgb(255, 73, 73);
      }
      &.active {
        background-color: lighten(#17ab68, 4%);
        color: #fff;
        transition: background-color 0.3s;
        &:hover {
          background-color: lighten(#17ab68, 6%);
        }
        .user {
          p,
          span {
            color: #fff;
          }
        }
      }
      .user {
        display: grid;
        grid-template-columns: 40px 1fr;
        span {
          font-size: 14px;
          margin-left: 5px;
          color: #999;
        }
        .unit-identifier {
          align-self: center;
          text-align: center;
          span {
            width: 10px;
            height: 10px;
            border-radius: 100%;
            display: inline-block;
          }
        }
        p {
          margin: 0;
          font-size: 13px;
          color: #999;
        }
      }
    }
  }
}
</style>

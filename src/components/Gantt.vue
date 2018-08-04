<template>
  <div>
    <div class="header">
      <div class="navigation">
      <span @click="previousYear"><</span>
      <span @click="years = 0">{{currentYear}}</span>
      <span @click="nextYear">></span>
      </div>
      <input class="search" :placeholder="`${$t('search')}...`" type="text" v-model="search">
    </div>

    <div class="gantt">
        <div class="row months">
          <div class="first-column">{{ $tc('month') }}</div>
          <span v-for="name in shortMonthNames" :key="name">{{name}}</span>
        </div>
        <div class="row lines">
          <span v-for="name in shortMonthNames" :key="name +'line'"></span>
        </div>

        <div class="row" v-for="user in allUsers" :key="user.name"  :class="!user.projects.length ? 'empty' : ''" >
          <div class="first-column">
            {{user.name}}
            <p>{{ $tc('project.self', user.projects.length) }} {{user.projects.length}} ({{$t('parallel')}}: {{user.maxConcurrentProjects}})</p>
          </div>
          <ul class="projects">
            <li
            @click="$router.push(`/project/edit/${project.id}`)"
            v-for="(project, index) in user.projects"
            v-tooltip="project.name"
            :key="project.id"
            :class="[getDirection(project.dateStart, project.dateEnd), highlightClass(project)]"
            :style="getGridStyle(project, index)"></li>
          </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import find from 'lodash/find';

export default {
  name: 'Gantt',
  props: {
    users: Array,
    highlightProject: {
      type: Number,
      default: -1
    },
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      years: 0,
      search: ''
    };
  },
  computed: {
    ...mapGetters(['projects', 'projectsByUser']),
    shortMonthNames() {
      return moment.monthsShort();
    },
    currentDate() {
      if (this.date) {
        return moment(this.date);
      }
      return moment();
    },
    allUsers() {
      const users = this.users.filter(user => new RegExp(this.search.toLowerCase(), 'g').test(user.name.toLowerCase()));

      return users.map(user => ({
        ...user,
        maxConcurrentProjects: this.getUsersMaxConcurrentProjects(user),
        projects: this.projects.filter(project => project.users.filter(pUser => pUser.name === user.name).length > 0)
      }));
    },
    currentYear() {
      return parseInt(this.currentDate.format('YYYY'), 0) + this.years;
    }
  },
  methods: {
    getUsersMaxConcurrentProjects(user) {
      const userProjects = this.projectsByUser(user);

      const concurrentProjects = userProjects.map(
        project => userProjects.filter(data => project.dateStart.within(data.range)).length
      );

      return concurrentProjects.length ? Math.max(...concurrentProjects) : 0;
    },

    nextYear() {
      this.years += 1;
    },
    previousYear() {
      this.years -= 1;
    },
    highlightClass(project) {
      if (this.highlightProject >= 0) {
        if (this.highlightProject === project.id) {
          return 'highlight';
        } else {
          return 'lowlight';
        }
      }
      return '';
    },
    getDirection(dateStart, dateEnd) {
      const startYear = parseInt(dateStart.format('YYYY'), 0);
      const endYear = parseInt(dateEnd.format('YYYY'), 0);

      if (startYear === this.currentYear && endYear > this.currentYear) {
        return 'right';
      } else if (endYear === this.currentYear && startYear < this.currentYear) {
        return 'left';
      } else if (startYear < this.currentYear && endYear > this.currentYear) {
        return 'expand';
      } else if (startYear === this.currentYear && endYear === this.currentYear) {
        return 'same';
      }
      return 'hidden';
    },
    getGridStyle({ dateStart, dateEnd, name, id, color }, index) {
      const startYear = parseInt(dateStart.format('YYYY'), 0);
      const endYear = parseInt(dateEnd.format('YYYY'), 0);

      const startMonth = parseInt(dateStart.format('M'), 0);
      const endMonth = parseInt(dateEnd.format('M'), 0);

      const direction = this.getDirection(dateStart, dateEnd);

      let gridColumn = ``;
      let gridRow = `${index + 1}`;

      if (direction === 'right') {
        gridColumn = `${startMonth}/-1`;
      } else if (direction === 'left') {
        gridColumn = `1/${endMonth + 1}`;
      } else if (direction === 'same') {
        gridColumn = `${startMonth}/${endMonth + 1}`;
      } else if (direction === 'expand') {
        gridColumn = `1/-1`;
      }

      if (direction) {
        return {
          gridColumn,
          gridRow,
          backgroundColor: color
        };
      }
    }
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.header {
  display: grid;
  grid-template-columns: 1fr 300px;
  margin: 0 0 20px 0;
  .navigation {
    text-align: center;
    margin: 0;
    align-self: center;
    span {
      padding: 0 15px;
      cursor: pointer;
    }
  }
}
.gantt {
  display: grid;
  border: 1px solid #ddd;
  position: relative;
  .row {
    display: grid;
    grid-template-columns: 150px 1fr;
    &:nth-child(even) {
      background-color: #f5f5f5;
      .first-column {
        background-color: #f5f5f5;
      }
    }
    &:nth-child(3) {
      .projects {
        border-top: 0;
      }
    }
    &.empty {
      background-color: rgb(238, 142, 142);
    }
    &.lines {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: transparent;
      grid-template-columns: 150px repeat(12, 1fr);
      .first-column {
        background-color: transparent;
      }
      span {
        border-right: 1px solid rgba(221, 221, 221, 0.8);
      }
    }
    &.months {
      background-color: #eee;
      border-bottom: 1px solid #ddd;
      grid-template-columns: 150px repeat(12, 1fr);
      span {
        text-align: center;
        font-size: 12px;
        align-self: center;
        font-weight: bold;
      }
    }
    .first-column {
      background-color: #eee;
      border-right: 1px solid #ddd;
      padding: 5px;
      font-size: 12px;
      font-weight: bold;
      p {
        margin: 0;
        font-weight: normal;
        font-size: 11px;
      }
    }
    .projects {
      list-style: none;
      display: grid;
      margin: 0;
      padding: 0;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 10px 0;
      border-top: 1px solid rgba(221, 221, 221, 0.8);
      padding: 10px 0;
      li {
        text-align: center;
        font-size: 13px;
        height: 15px;
        background-color: #55de84;
        border-radius: 6px;
        color: #fff;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        &.highlight {
          opacity: 1;
        }
        &.lowlight {
          background-color: #ddd !important;
        }
        &.left {
          box-shadow: inset 5px 0 10px -5px rgba(0, 0, 0, 0.8);
          border-radius: 0 6px 6px 0;
        }
        &.right {
          box-shadow: inset -5px 0 10px -5px rgba(0, 0, 0, 0.8);
          border-radius: 6px 0 0 6px;
        }
        &.expand {
          box-shadow: inset 9px 0 10px -10px rgba(0, 0, 0, 0.8), inset -9px 0 10px -10px rgba(0, 0, 0, 0.8);
          border-radius: 0;
        }
        &.hidden {
          visibility: hidden;
        }
        span {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
}
</style>

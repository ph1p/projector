<template>
  <div v-if="allUsers">
    <div v-if="!disableHeader" class="header">
      <div class="navigation">
      <span @click="previousYear"><</span>
      <span @click="years = 0">{{currentYear}}</span>
      <span @click="nextYear">></span>
      </div>
      <input class="search" :placeholder="`${$t('search')}...`" type="text" v-model="search">
    </div>

    <div class="gantt">
      <div class="gantt__row gantt__row--months">
        <div class="gantt__row-first"></div>
        <span v-for="name in shortMonthNames" :key="name">{{name}}</span>
      </div>
      <div class="gantt__row gantt__row--lines">
        <span v-for="name in shortMonthNames" :key="name +'line'"></span>
      </div>

      <div class="gantt__row" v-for="user in allUsers" :key="user.name"  :class="!user.projects.length ? 'gantt__row--empty' : ''" >
        <div class="gantt__row-first">
          {{user.name}}
          <p v-if="user.projects.length > 1">{{ $tc('project.self', user.projects.length) }} {{user.projects.length}} ({{$t('parallel')}}: {{user.maxConcurrentProjects}})</p>
        </div>
        <ul class="gantt__row-bars">
          <li
          @click="$router.push(`/project/${project.id}`)"
          v-for="(project, index) in user.projects"
          v-tooltip="project.name"
          :key="project.id"
          :class="[getDirection(project.dateStart, project.dateEnd), highlightClass(project)]"
          :style="getGridStyle(project, index)"><span>{{project.name}}</span></li>
        </ul>
      </div>
    </div>

    <i18n path="pagination" tag="div" v-if="showPagination" class="pagination">
      <strong>{{pages}}</strong>{{pageLimit}}
    </i18n>
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
    },
    disableHeader: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    start: {
      type: Number,
      default: -1
    },
    limit: {
      type: Number,
      default: -1
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
    pages() {
      return Math.ceil(this.start / this.limit) + 1;
    },
    pageLimit() {
      return Math.ceil(this.users.length / this.limit);
    },
    currentDate() {
      if (this.date) {
        return moment(this.date);
      }
      return moment();
    },
    limitEnd() {
      return this.start + this.limit;
    },
    allUsers() {
      return (
        this.users
          // search filter
          .filter(user => new RegExp(this.search.toLowerCase(), 'g').test(user.name.toLowerCase()))
          // map through each user
          .map(user => ({
            ...user,
            maxConcurrentProjects: this.getUsersMaxConcurrentProjects(user),
            projects: this.projects.filter(
              project => project.users.filter(pUser => pUser.name === user.name).length > 0
            )
          }))
          // filter user if limiters are passed
          .filter((u, k) => (this.start < 0 || k >= this.start) && (this.limitEnd < 0 || k < this.limitEnd))
      );
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

.pagination {
  text-align: center;
  margin: 20px 0;
  span {
    font-weight: bold;
    display: inline-block;
  }
}
.gantt {
  display: grid;
  border: 0;
  border: 1px solid #ddd;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  &__row {
    display: grid;
    grid-template-columns: 150px 1fr;
    background-color: #fff;
    &:nth-child(odd) {
      background-color: #f5f5f5;
      .gantt__row-first {
        background-color: #f5f5f5;
      }
    }
    &:nth-child(3) {
      .gantt__row-bars {
        border-top: 0;
      }
      .gantt__row-first {
        border-top: 0;
      }
    }
    &--empty {
      background-color: lighten(#999, 25%) !important;
      background-image: repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,.1) 3px, rgba(255,255,255,.1) 8px);
      z-index: 1;
      .gantt__row-first {
        border-width: 1px 1px 0 0;
      }
    }
    &--lines {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: transparent;
      grid-template-columns: 150px repeat(12, 1fr);
      span {
        display: block;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        &.marker {
          background-color: rgba(10, 52, 68, 0.13);
          z-index: 2;
        }
      }
      &:after {
        grid-row: 1;
        grid-column: 0;
        background-color: #1688b345;
        z-index: 2;
        height: 100%;
      }
    }
    &--months {
      color: #fff;
      background-color: #0a3444 !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      grid-template-columns: 150px repeat(12, 1fr);
      .gantt__row-first {
        border-top: 0 !important;
        background-color: #0a3444 !important;
      }
      span {
        text-align: center;
        font-size: 13px;
        align-self: center;
        font-weight: bold;
        padding: 20px 0;
      }
    }
    &-first {
      background-color: #fff;
      border-width: 1px 0 0 0;
      border-color: rgba(0, 0, 0, 0.1);
      border-style: solid;
      padding: 15px 15px;
      font-size: 13px;
      font-weight: bold;
      text-align: left;
      p {
        margin: 0;
        font-weight: normal;
        font-size: 11px;
      }
    }
    &-bars {
      list-style: none;
      display: grid;
      padding: 9px 0;
      margin: 0;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 8px 0;
      border-top: 1px solid rgba(221, 221, 221, 0.8);
      li {
        font-weight: 500;
        text-align: left;
        font-size: 12px;
        height: 25px;
        background-color: #55de84;
        padding: 5px 12px;
        color: #fff;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        border-radius: 20px;
        span {
          overflow: hidden;
          display: block;
        }

        &.highlight {
          opacity: 1;
        }
        &.lowlight {
          background-color: #ddd !important;
          color: #2c3e50;
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
        &.stripes {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            rgba(255, 255, 255, 0.1) 5px,
            rgba(255, 255, 255, 0.1) 12px
          );
        }

        &:before,
        &:after {
          content: '';
          height: 100%;
          top: 0;
          z-index: 4;
          position: absolute;
          background-color: rgba(0, 0, 0, 0.3);
        }
        &:before {
          left: 0;
        }
        &:after {
          right: 0;
        }
      }
    }
  }
}
</style>

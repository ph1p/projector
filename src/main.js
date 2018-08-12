import Vue from 'vue';
import VTooltip from 'v-tooltip';
import VueI18n from 'vue-i18n';
import Snotify from 'vue-snotify';
import groupBy from 'lodash/groupBy';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import { users, units, positions } from '@/data';

Vue.config.productionTip = false;

Vue.use(VTooltip);
Vue.use(Snotify, {
  toast: {
    timeout: 5000
  }
});
Vue.use(VueI18n);

const locales = require.context('../locales', true, /^\.\/.*\.json$/);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: locales.keys().reduce((before, after) => {
    before[after.match(/.\/(.*)\.json/)[1]] = locales(after);

    return before;
  }, {})
});

const helpers = {
  data() {
    return {
      globalData: {
        users,
        units,
        positions
      }
    };
  },
  computed: {
    getRandomColor() {
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  },
  methods: {
    groupByUnit(users) {
      return groupBy(users, 'unit.name');
    },
    generateUsername(name) {
      const [firstname, lastname] = name.toLowerCase().split(' ');

      return `${firstname.substr(0, 1)}.${lastname.substr(0, lastname.length)}`;
    },
    getUsersByIds(userIds) {
      return userIds.map(id => this.findUserById(id));
    },
    findUserById(id) {
      return this.globalData.users.filter(user => user.id === id)[0] || {};
    }
  }
};

Vue.mixin(helpers);

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');

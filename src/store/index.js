import Vue from 'vue';
import createPersistedState from 'vuex-persistedstate';
import Vuex from 'vuex';
import teams from './modules/teams';
import projects from './modules/projects';
import settings from './modules/settings';
import data from '../data';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    teams,
    projects,
    settings
  },
  plugins: [createPersistedState()]
});

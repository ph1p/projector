import find from 'lodash/find';

import data from '../../data';

const state = {
  data: []
};

const mutations = {
  remove(state, team) {
    state.data = state.data.filter(p => team.id !== p.id);
  },
  update(state, team) {
    state.data = state.data.map(p => (team.id === p.id ? team : p));
  },
  add(state, team) {
    if (team.name && team.users && team.users.length > 0) {
      state.data.push({
        id: state.data.length + 1,
        ...team
      });
    }
  }
};

const getters = {
  teams: state => state.data,
  teamsByUser: state => user =>
    state.data
      .filter(team =>
        find(team.users, {
          id: user.id
        })
      )
      .map(team => ({
        ...team
      })),
  teamById: state => id => state.data.filter(team => team.id === parseInt(id, 0))[0]
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};

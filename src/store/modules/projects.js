import Moment from 'moment';
import find from 'lodash/find';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

import data from '../../data';

const state = {
  data: []
};

const mutations = {
  update(state, project) {
    const updatedProject = {
      ...project,
      dateStart: project.dateStart,
      dateEnd: project.dateEnd
    };

    state.data = state.data.map(p => (project.id === p.id ? updatedProject : p));
  },
  add(state, project) {
    const newProject = {
      ...project,
      dateStart: project.dateStart,
      dateEnd: project.dateEnd
    };

    state.data.push({
      id: state.data.length + 1,
      ...newProject
    });
  }
};

const getters = {
  projects: state =>
    state.data.map(project => {
      return {
        ...project,
        dateStart: moment(project.dateStart),
        dateEnd: moment(project.dateEnd),
        range: moment.range(project.dateStart, project.dateEnd)
      };
    }),
  projectsByUser: state => user =>
    state.data
      .filter(project =>
        find(project.users, {
          name: user.name
        })
      )
      .map(project => ({
        ...project,
        dateStart: moment(project.dateStart),
        dateEnd: moment(project.dateEnd),
        range: moment.range(project.dateStart, project.dateEnd)
      })),
  projectById: state => id => state.data.filter(project => project.id === parseInt(id, 0))[0]
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};

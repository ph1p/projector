const state = {
  maxConcurrentProjectsPerUser: 3,
  language: 'en'
};

const mutations = {
  setLanguage(state, language) {
    state.language = language;
  }
};

const getters = {
  maxConcurrentProjectsPerUser: state => state.maxConcurrentProjectsPerUser,
  language: state => state.language
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};

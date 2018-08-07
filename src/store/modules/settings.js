export default {
  state: {
    maxConcurrentProjectsPerUser: 3,
    language: 'en'
  },
  mutations: {
    setLanguage(state, language) {
      state.language = language;
    },
  },
  getters: {
    maxConcurrentProjectsPerUser: state => state.maxConcurrentProjectsPerUser,
    language: state => state.language
  },
  actions: {}
};

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userMetadata: {
      id: null,
      isAuthenticated: false,
      token: null,
    },
  },
  getters: {
  },
  // Used for normal actions
  mutations: {
  },
  // Used to async actions
  actions: {
  },
  modules: {
  },
});

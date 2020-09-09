import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    location: ''
  },
  mutations: {
    updateLocation(state, data) {
      state.location = data;
    },
  },
  actions: {},
  modules: {}
})
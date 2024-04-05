import Vue from 'vue';
import Vuex from 'vuex';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

Vue.use(Vuex);

  const store = new Vuex.Store({
    // Initial store states
    state: {
      userMetadata: {
        id: "",
        isAuthenticated: false,
        token: "",
      },
      resetCustomInput: false
    },
    getters: {
      userMetadata(state) {
        return state.userMetadata;
      }
    },
    // Used for normal actions
    mutations: {
      setUserMetadata(state, payload: { id: string, token: string }){
        state.userMetadata = {
          id: payload.id,
          isAuthenticated: true,
          token: payload.token
        }
      },
      resetCustomInput(state){
        state.resetCustomInput = !state.resetCustomInput
      }
    },
    // Used to async actions
    actions: {
      handleUserAuthentication(ctx) {
        const getToken = Cookies.get("vue-app-session") ?? "";

        if (!getToken) return;

        const tokenDecoded = jwtDecode(getToken);

        ctx.commit("setUserMetadata", { id: tokenDecoded.sub, token: getToken })
      }
    },
    // Used to split our application stores
    modules: {
    },
  });

export default store;

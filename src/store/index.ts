import Vue from 'vue';
import Vuex from 'vuex';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import api from '../lib/api';

Vue.use(Vuex);

  const store = new Vuex.Store({
    // Initial store states
    state: {
      userMetadata: {
        id: "",
        isAuthenticated: false,
        token: "",
        name: "",
        email: "",
        profilePicture: ""
      },
      resetCustomInput: false,
      activeView: "contactView",
    },
    getters: {
      userMetadata(state) {
        return state.userMetadata;
      },
      activeView(state) {
        return state.activeView;
      }
    },

    // Used for normal actions
    mutations: {
      changeActiveView(state, payload: string){
        state.activeView = payload
      },
      setUserMetadata(state, payload: { id: string, token: string, email: string, name: string, profilePicture: string }){
        state.userMetadata = {
          id: payload.id,
          isAuthenticated: true,
          token: payload.token,
          email: payload.email,
          name: payload.name,
          profilePicture: payload.profilePicture
        }
      },
      logoutSession(state){
        Cookies.remove("vue-app-session")

        state.userMetadata = {
          id: "",
          isAuthenticated: false,
          token: "",
          email: "",
          name: "",
          profilePicture: ""
        }

        window.location.href = "/login"
      },
      resetCustomInput(state){
        state.resetCustomInput = !state.resetCustomInput
      }
    },
    // Used to async actions
    actions: {
     async handleUserAuthentication(ctx) {
        const getToken = Cookies.get("vue-app-session") ?? "";

        if (!getToken) return;

        const tokenDecoded = jwtDecode(getToken);

        try {
         /*  const responseProfile = await api.get("/api/v1/user/profile", {
            headers: {
              Authorization: `Bearer ${getToken}`
            }
          }) */

          ctx.commit("setUserMetadata", {
            id: tokenDecoded.sub,
            token: getToken,
           /*  name: responseProfile.data.name,
            email: responseProfile.data.email,
            profilePicture: responseProfile.data.profilePicture */
           })
        }catch(e){
          console.log(e)
          throw new Error("Error while getting profile...")
        }
      }
    },
    // Used to split our application stores
    modules: {
    },
  });

export default store;

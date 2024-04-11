import Vue from 'vue';
import Vuex from 'vuex';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import api from '../lib/api';
import dateFormatter from '../utils/dateFormatter';
import { AxiosError } from 'axios';

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
      listOfContacts: [],
      listofFolders: []
    },
    getters: {
      userMetadata(state) {
        return state.userMetadata;
      },
      activeView(state) {
        return state.activeView;
      },
      listOfContacts(state){
        return state.listOfContacts
      },
      listOfFolders(state){
        return state.listofFolders
      }
    },

    // Used for normal actions
    mutations: {
      changeFoldersList(state, payload){
        state.listofFolders = payload;
      },
      changeContactList(state, payload){
        state.listOfContacts = payload;
      },
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
      },

      async getUserContacts(ctx, { page, perPage, token, pageOptions }: {
        page: number,
        perPage: number,
        token: string,
        pageOptions: {}
      }){
        try {
          const requestContacts = await api.get(
            `/api/v1/contact/list-all?page=${page}&size=${perPage}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const contacts = requestContacts.data.contactsList.map((contact: any) => {
            contact.createdAt = dateFormatter(new Date(contact.createdAt));

            return contact;
          });

          pageOptions = {
            ...pageOptions,
            page: contacts.page + 1,
            itemsPerPage: contacts.pageSize,
            totalPages: contacts.totalPages,
            totalElements: contacts.totalElements,
          };

          ctx.commit("changeContactList", contacts)
        } catch (e) {
          if (e instanceof AxiosError) {
            console.log(e);
          }
        }
      },
      async getUserFolders(ctx, { page, perPage, token, pageOptions }: {
        page: number,
        perPage: number,
        token: string,
        pageOptions: {}
      }){
        try {
          const requestContacts = await api.get(
            `/api/v1/folder/all?page=${page}&size=${perPage}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const folders = requestContacts.data.foldersList.map((contact: any) => {
            contact.createdAt = dateFormatter(new Date(contact.createdAt));

            return contact;
          });

          pageOptions = {
            ...pageOptions,
            page: folders.page + 1,
            itemsPerPage: folders.pageSize,
            totalPages: folders.totalPages,
            totalElements: folders.totalElements,
          };

          ctx.commit("changeFoldersList", folders)
        } catch (e) {
          if (e instanceof AxiosError) {
            console.log(e);
          }
        }
      }
    },
    // Used to split our application stores
    modules: {
    },
  });

export default store;

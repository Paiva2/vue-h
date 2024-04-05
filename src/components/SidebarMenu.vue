<template>
  <header class="sidebar-header">
    <nav class="menu-items">
      <ul class="menu-list">
        <div class="text-center">
          <v-menu
            v-model="openProfileMenu"
            :close-on-content-click="false"
            :nudge-width="250"
            :nudge-right="10"
            offset-x
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" fab color="teal">
                <v-icon dark> mdi-account </v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="John"
                    />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>John Leider</v-list-item-title>
                    <v-list-item-subtitle
                      >Founder of Vuetify</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  <v-dialog
                    v-model="openProfileForm"
                    persistent
                    max-width="600px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        large
                        width="100%"
                        color="#7c5dfa"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        Edit profile
                      </v-btn>
                    </template>
                    <EditProfileForm
                      :handleOpenProfileForm="handleOpenProfileForm"
                    />
                  </v-dialog>
                </v-list-item>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="red" text @click="handleLogout"> Logout </v-btn>
                <v-btn color="#fff  " text @click="handleOpenProfileMenu">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>

        <li>
          <v-btn class="mx-2" fab dark color="teal">
            <v-icon dark> mdi-format-list-bulleted-square </v-icon>
          </v-btn>
        </li>
        <li>
          <v-btn class="mx-2" fab dark color="teal">
            <v-icon dark> mdi-format-list-bulleted-square </v-icon>
          </v-btn>
        </li>
        <li>
          <v-btn class="mx-2" fab dark color="teal">
            <v-icon dark> mdi-format-list-bulleted-square </v-icon>
          </v-btn>
        </li>
        <li>
          <v-btn class="mx-2" fab dark color="teal">
            <v-icon dark> mdi-format-list-bulleted-square </v-icon>
          </v-btn>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapMutations } from "vuex";
import EditProfileForm from "./EditProfileForm.vue";
import store from "../store";

export default {
  name: "SidebarMenu",
  components: {
    EditProfileForm,
  },
  data() {
    return {
      openProfileForm: false,
      openProfileMenu: false,
    };
  },
  methods: {
    ...mapMutations(["logoutSession"]),
    handleOpenProfileForm() {
      this.openProfileForm = !this.openProfileForm;
    },
    handleOpenProfileMenu() {
      this.openProfileMenu = !this.openProfileMenu;
    },
    handleLogout() {
      this.handleOpenProfileMenu();
      store.commit("logoutSession");
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-header {
  width: 100%;
  max-width: 100px;
  height: 100%;
  background-color: #373c63;
  border-radius: 20px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  .menu-items {
    width: 100%;
    padding: 1.25rem;

    .menu-list {
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
      list-style: none;
      font-size: 18px;
      align-items: center;
      gap: 30px;

      li {
        color: red;
      }
    }
  }
}
</style>

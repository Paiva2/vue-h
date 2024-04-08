<template>
  <v-card>
    <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <img
            :src="
              userMetadata?.profilePicture ??
              'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
            "
            alt="Profile Picture"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{
            userMetadata?.name ?? "Undefined"
          }}</v-list-item-title>
          <v-list-item-subtitle>User</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item>
        <v-dialog v-model="openProfileForm" persistent max-width="600px">
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
            :openProfileForm="openProfileForm"
            :handleOpenProfileForm="handleOpenProfileForm"
          />
        </v-dialog>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="red" text @click="handleLogout"> Logout </v-btn>
      <v-btn color="#fff" text @click="handleOpenProfileMenu"> Close </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store";
import EditProfileForm from "./EditProfileForm.vue";

export default {
  name: "ProfileMenu",
  data() {
    return {
      openProfileForm: false,
      openProfileMenu: false,
    };
  },
  computed: {
    ...mapGetters(["userMetadata"]),
  },
  components: {
    EditProfileForm,
  },
  props: {
    handleOpenProfileMenu: Function,
  },
  methods: {
    handleLogout() {
      this.handleOpenProfileMenu();
      store.commit("logoutSession");
    },
    handleOpenProfileForm() {
      this.openProfileForm = !this.openProfileForm;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

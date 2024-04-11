<template>
  <header class="sidebar-header elevation-5">
    <nav class="menu-items">
      <ul class="menu-list">
        <v-menu
          v-model="openProfileMenu"
          :close-on-content-click="false"
          :nudge-width="250"
          :nudge-right="10"
          offset-x
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="open-profile-btn" v-bind="attrs" v-on="on" fab>
              <img
                :src="
                  userMetadata?.profilePicture ??
                  'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
                "
                alt="Profile Picture"
              />
            </v-btn>
          </template>

          <ProfileMenu :handleOpenProfileMenu="handleOpenProfileMenu" />
        </v-menu>

        <li v-for="item in menuOptions" :key="item.id">
          <v-btn
            @click="changeActiveView(item.value)"
            block
            class="menu-button"
            depressed
            :color="setActiveMenuItem(item.value)"
          >
            <v-icon color="#20212B">{{ item.icon }}</v-icon>
            <span>{{ item.label }}</span>
          </v-btn>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import EditProfileForm from "./EditProfileForm.vue";
import ProfileMenu from "./ProfileMenu.vue";
import menuOptions from "../resources/menuOptions";

export default {
  name: "SidebarMenu",
  components: {
    EditProfileForm,
    ProfileMenu,
  },
  data() {
    return {
      openProfileMenu: false,
      menuOptions,
    };
  },
  computed: {
    ...mapGetters(["activeView", "userMetadata"]),
  },
  methods: {
    ...mapMutations(["changeActiveView"]),
    handleOpenProfileMenu() {
      this.openProfileMenu = !this.openProfileMenu;
    },
    setActiveMenuItem(menuName) {
      return menuName === this.activeView
        ? "rgba(245, 245, 245, 0.8)"
        : "rgba(245, 245, 245, 0.4)";
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-header {
  width: 100%;
  max-width: 15rem;
  height: 100%;
  background-color: #373c63;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  .menu-items {
    width: 100%;
    padding-top: 1.25rem;

    .menu-list {
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
      list-style: none;
      font-size: 18px;
      align-items: center;

      li {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .open-profile-btn {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.25rem;

        &::v-deep {
          .v-btn__content {
            height: 100%;
            width: 100%;
          }
        }

        img {
          object-fit: cover;
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }

      .menu-button {
        height: 50px;
        font-weight: 500;
        color: rgb(0 0 0 / 87%);
        border-radius: 0;
        font-size: 0.875rem;
        gap: 10px;
        display: flex;
        align-items: center;

        span {
          width: 5.625rem;
          margin-left: 0.625rem;
          text-align: left;
        }
      }
    }
  }
}
</style>

<template>
  <div class="home">
    <SidebarMenu />

    <div class="views-wrapper">
      <ContactView v-if="activeView === 'contactView'" />
      <FoldersView v-if="activeView === 'foldersView'" />
      <DocumentsView v-if="activeView === 'documentsView'" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import SidebarMenu from "../components/SidebarMenu.vue";
import ContactView from "./contact-view";
import FoldersView from "./folders-view/index.vue";
import DocumentsView from "./documents-view/index.vue";

export default {
  data() {
    return {};
  },
  components: {
    SidebarMenu,
    ContactView,
    FoldersView,
    DocumentsView,
  },
  methods: {
    ...mapMutations(["setUserMetadata"]),
  },
  computed: {
    ...mapGetters(["userMetadata", "activeView"]),
  },
  created() {
    console.log(this.userMetadata);
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  display: flex;
  height: 100vh;

  .views-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

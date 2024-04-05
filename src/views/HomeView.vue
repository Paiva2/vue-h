<template>
  <div class="home">
    <SidebarMenu />

    <ContactView v-if="activeView === 'contactView'" />
    <FoldersView v-if="activeView === 'foldersView'" />
    <DocumentsView v-if="activeView === 'documentsView'" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import SidebarMenu from "../components/SidebarMenu.vue";
import ContactView from "./ContactView.vue";
import FoldersView from "./FoldersView.vue";
import DocumentsView from "./DocumentsView.vue";

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
}
</style>

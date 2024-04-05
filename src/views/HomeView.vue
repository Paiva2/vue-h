<template>
  <div class="home">
    <SidebarMenu />
    <h1>Authenticated home</h1>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import SidebarMenu from "../components/SidebarMenu.vue";

export default {
  data() {
    return {};
  },
  components: {
    SidebarMenu,
  },
  methods: {
    ...mapMutations(["setUserMetadata"]),
  },
  computed: {
    ...mapGetters(["userMetadata"]),
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

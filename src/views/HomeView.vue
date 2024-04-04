<template>
  <div>
    <h1>Authenticated home</h1>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapGetters, mapMutations } from "vuex";
import store from "../store";

export default {
  data() {
    return {};
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
</style>

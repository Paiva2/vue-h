<template>
  <div>
    <h1>Authenticated home</h1>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

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

<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">Edit profile</span>
    </v-card-title>
    <v-card-text> </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="handleSubmitEdit"> Save </v-btn>
      <v-btn color="red" text @click="handleOpenProfileForm"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "EditProfileForm",
  props: {
    handleOpenProfileForm: Function,
  },
  methods: {
    handleSubmitEdit() {
      this.handleOpenProfileForm();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

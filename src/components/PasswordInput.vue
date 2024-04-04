<template>
  <label class="password-field" for="password-field">
    <v-icon class="mail-icon" color="#b4b3b3" size="20" aria-hidden="false"> mdi-lock </v-icon>
    Password
    <input
      @input="handleComponentPassword"
      id="password-field"
      :value="componentPassword"
      placeholder="Enter your password"
      :type="showComponentPassword ? 'text' : 'password'"
    />
    <v-btn
      type="button"
      class="password-view-btn"
      elevation="0"
      color="secondary"
      fab
      x-small
      dark
      @click="handleShowComponentPassword"
    >
      <v-icon v-if="!showComponentPassword">mdi-eye-off-outline</v-icon>
      <v-icon v-else>mdi-eye-outline</v-icon>
    </v-btn>
  </label>
</template>

<script>
export default {
  data() {
    return {
      showComponentPassword: false,
      componentPassword: "",
    };
  },
  methods: {
    handleShowComponentPassword() {
      return (this.showComponentPassword = !this.showComponentPassword);
    },
    handleComponentPassword(e) {
      this.componentPassword = e.target.value;
      this.$emit("update:password-value", e.target.value);
    },
  },
  props: {},
  watch: {},
  name: "PasswordInput",
};
</script>

<style scoped></style>

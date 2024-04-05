<template>
  <label class="password-field" for="password-field">
    <v-icon class="password-icon" color="#b4b3b3" size="20" aria-hidden="false">
      mdi-lock
    </v-icon>
    Password
    <input
      @input="handleComponentPassword"
      id="password-field"
      :value="componentPassword"
      v-model="componentPassword"
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
      this.$emit("update:password-value", this.componentPassword);
    },
  },
  props: {},
  watch: {},
  name: "PasswordInput",
};
</script>

<style lang="scss" scoped>
.password-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 500;
  position: relative;

  input {
    background-color: #20212b;
    height: 3.125rem;
    border: 0;
    color: #fff;
    font-size: 1rem;
    border-radius: 5px;
    padding-left: 2.5rem;
    font-size: 1.125rem;
    padding-right: 2.8125rem;

    &:active,
    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #b4b3b3;
    }
  }

  .password-icon {
    position: absolute;
    top: 50px;
    left: 10px;
  }

  .password-view-btn {
    position: absolute;
    right: 8px;
    top: 44px;
  }
}
</style>

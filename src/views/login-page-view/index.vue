<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="title-wrapper">
        <h2 class="login-title">Login</h2>
        <p class="greeting-text">Welcome! Use your credetials to get in!</p>
      </div>

      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from "./components/LoginForm.vue";

export default {
  components: {
    LoginForm,
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;

  .login-wrapper {
    display: flex;
    flex-direction: column;
    background-color: #252945;
    width: 100%;
    height: 100%;
    max-width: 37.5rem;
    border-radius: 8px;
    padding: 2.5rem;

    .title-wrapper {
      display: flex;
      flex-direction: column;

      .login-title {
        color: #fff;
        font-weight: 500;
        font-size: 2.1875rem;
      }

      .greeting-text {
        color: #b4b3b3;
        font-size: 1rem;
        font-weight: 500;
      }
    }
  }
}
</style>

<template>
  <div class="forgotPassword-container">
    <div class="forgotPassword-wrapper">
      <div class="title-wrapper">
        <h2 class="forgotPassword-title">Forgot Password</h2>
        <p class="greeting-text">Recover your password bellow!</p>
      </div>

      <ForgotPasswordForm />
    </div>
  </div>
</template>

<script>
import ForgotPasswordForm from "../components/ForgotPasswordForm.vue";

export default {
  name: "ForgotPasswordView",
  components: {
    ForgotPasswordForm,
  },
};
</script>

<style lang="scss" scoped>
.forgotPassword-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;

  .forgotPassword-wrapper {
    display: flex;
    flex-direction: column;
    background-color: #252945;
    width: 100%;
    height: 100%;
    max-width: 37.5rem;
    border-radius: 8px;
    padding: 2.5rem;
    gap: 0.9375rem;

    .title-wrapper {
      display: flex;
      flex-direction: column;

      .forgotPassword-title {
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

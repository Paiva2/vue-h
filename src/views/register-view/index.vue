<template>
  <div class="register-container">
    <div class="register-wrapper">
      <div class="title-wrapper">
        <h2 class="register-title">Register</h2>
        <p class="greeting-text">New here? Create a new account!</p>
      </div>

      <RegisterForm />
    </div>
  </div>
</template>

<script>
import RegisterForm from "./components/RegisterForm.vue";

export default {
  data() {
    return {};
  },
  components: {
    RegisterForm,
  },
};
</script>

<style lang="scss" scoped>
.register-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;

  .register-wrapper {
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

      .register-title {
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

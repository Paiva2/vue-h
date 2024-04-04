<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <v-btn
      :disabled="sendingLogin"
      class="github-login-btn"
      height="50"
      type="button"
      large
      color="#7c5dfa"
      elevation="5"
    >
      <v-icon class="github-icon" color="#fff" size="30" aria-hidden="false"> mdi-github </v-icon>
      Sign in with Github
    </v-btn>
    <div class="fields-section">
      <label class="email-field" for="email-field">
        <v-icon class="mail-icon" color="#b4b3b3" size="20" aria-hidden="false"> mdi-email </v-icon>
        E-mail address
        <input
          v-model="email"
          id="email-field"
          type="text"
          placeholder="Enter your e-mail address"
        />
      </label>

      <label class="password-field" for="password-field">
        <v-icon class="mail-icon" color="#b4b3b3" size="20" aria-hidden="false"> mdi-lock </v-icon>
        Password
        <input
          v-model="password"
          id="password-field"
          :type="togglePasswordView"
          placeholder="Enter your password"
        />
        <v-btn
          type="button"
          class="password-view-btn"
          elevation="0"
          color="secondary"
          fab
          x-small
          dark
          @click="showPassword = !showPassword"
        >
          <v-icon v-if="!showPassword">mdi-eye-off-outline</v-icon>
          <v-icon v-else>mdi-eye-outline</v-icon>
        </v-btn>
      </label>
    </div>

    <p>
      Forgot your
      <a class="forgot-password-link" href="#">password? </a>
    </p>

    <v-btn
      :loading="sendingLogin"
      :disabled="sendingLogin"
      height="50"
      type="submit"
      large
      color="#7c5dfa"
      elevation="5"
    >
      Sign in
    </v-btn>

    <p>
      Not registered yet?
      <a href="#" class="register-link">
        Register now!
        <v-icon class="mail-icon" color="#7d5cfa" size="16" aria-hidden="false">
          mdi-open-in-new
        </v-icon>
      </a>
    </p>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      sendingLogin: false,
      showPassword: false,
    };
  },
  watch: {},
  computed: {
    togglePasswordView() {
      return this.showPassword ? "text" : "password";
    },
  },
  methods: {
    handleLogin() {
      this.sendingLogin = true;
      setTimeout(() => (this.sendingLogin = false), 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.875rem;

  .fields-section {
    display: flex;
    flex-direction: column;
    gap: 0.9375rem;

    label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: #fff;
      font-size: 1.125rem;
      font-weight: 500;

      input {
        background-color: #20212b;
        height: 3.125rem;
        border: 0;
        color: #fff;
        font-size: 1rem;
        border-radius: 5px;
        padding-left: 2.5rem;
        font-size: 1.125rem;

        &:active,
        &:focus {
          outline: none;
        }

        &::placeholder {
          color: #b4b3b3;
        }
      }
    }

    .email-field,
    .password-field {
      position: relative;

      .mail-icon,
      .password-icon {
        position: absolute;
        top: 50px;
        left: 10px;
      }
    }

    .password-field {
      input {
        padding-right: 2.8125rem;
      }

      .password-view-btn {
        position: absolute;
        right: 8px;
        top: 44px;
      }
    }
  }

  .register-link,
  .forgot-password-link {
    color: #7d5cfa;
    font-weight: 500;
  }

  .github-login-btn {
    margin-top: 1.875rem;
  }
}
</style>

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
      <v-icon class="github-icon" color="#fff" size="30" aria-hidden="false">
        mdi-github
      </v-icon>
      Sign in with Github
    </v-btn>
    <div class="fields-section">
      <div class="field-wrapper">
        <FormInput
          iconName="mdi-email"
          label="E-mail address"
          holder="Enter your e-mail address"
          emitterAlias="mail-value"
          v-on:update:mail-value="handleEmailValue"
        />
        <p v-if="formErrors.email" class="field-error">
          {{ formErrors.email }}
        </p>
      </div>

      <div class="field-wrapper">
        <PasswordInput
          label="Password"
          holder="Enter your password"
          emitterAlias="password-value"
          v-on:update:password-value="handlePasswordValue"
        />
        <p v-if="formErrors.password" class="field-error">
          {{ formErrors.password }}
        </p>
      </div>
    </div>

    <p>
      Forgot your
      <router-link class="forgot-password-link" to="/forgot-password"
        >password?
      </router-link>
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
      <router-link to="/register" class="register-link">
        Register now!
        <v-icon class="mail-icon" color="#7d5cfa" size="16" aria-hidden="false">
          mdi-open-in-new
        </v-icon>
      </router-link>
    </p>

    <p v-if="apiErrors" class="apiError">{{ apiErrors }}</p>
  </form>
</template>

<script>
import isEmail from "validator/lib/isEmail";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import router from "../../../router";
import { jwtDecode } from "jwt-decode";
import PasswordInput from "../../../components/PasswordInput.vue";
import FormInput from "../../../components/FormInput.vue";
import api from "../../../lib/api";

export default {
  data() {
    return {
      email: "",
      password: "",
      sendingLogin: false,
      apiErrors: "",
      formErrors: {},
    };
  },
  components: {
    PasswordInput,
    FormInput,
  },
  methods: {
    async handleLogin() {
      this.checkFormErrors();

      const formHasErrors = Object.keys(this.formErrors).length > 0;

      if (formHasErrors) return;

      this.sendingLogin = true;
      this.formErrors = {};
      this.apiErrors = "";

      try {
        const response = await api.post("/api/v1/user/login", {
          email: this.email,
          password: this.password,
        });

        const tokenDecoded = jwtDecode(response.data.authToken);

        Cookies.set("vue-app-session", response.data.authToken, {
          expires: new Date(tokenDecoded.exp * 1000),
          path: "/",
        });

        this.resetData();

        router.push("/home");
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);
          this.apiErrors = e.response.data.message;
        }
      } finally {
        this.sendingLogin = false;
      }
    },
    handlePasswordValue(event) {
      this.password = event;
    },
    handleEmailValue(event) {
      this.email = event;
    },
    checkFormErrors() {
      const errors = {};

      if (!this.email) {
        errors.email = "E-mail can't be empty.";
      }

      if (!isEmail(this.email)) {
        errors.email = "Invalid e-mail format.";
      }

      if (!this.password) {
        errors.password = "Password can't be empty.";
      } else if (this.password.length < 6) {
        errors.password = "Password can't be less than 6 characters.";
      }

      this.formErrors = errors;
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this));
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

    .field-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .field-error {
        font-size: 1rem;
        color: rgb(233, 80, 80);
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

    .github-icon {
      margin-right: 0.3125rem;
    }
  }

  .apiError {
    color: rgb(233, 80, 80);
    text-align: center;
    font-size: 1.125rem;
    font-weight: 500;
  }
}
</style>

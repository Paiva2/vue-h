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
      <div class="field-wrapper">
        <label class="email-field" for="email-field">
          <v-icon class="mail-icon" color="#b4b3b3" size="20" aria-hidden="false">
            mdi-email
          </v-icon>
          E-mail address
          <input
            v-model="email"
            id="email-field"
            type="text"
            placeholder="Enter your e-mail address"
          />
        </label>
        <p v-if="formErrors.email" class="field-error">{{ formErrors.email }}</p>
      </div>

      <div class="field-wrapper">
        <PasswordInput v-on:update:password-value="handlePasswordValue" />
        <p v-if="formErrors.password" class="field-error">{{ formErrors.password }}</p>
      </div>
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

    <p v-if="apiErrors" class="apiError">{{ apiErrors }}</p>
  </form>
</template>

<script>
import PasswordInput from "../components/PasswordInput.vue";
import isEmail from "validator/lib/isEmail";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie"
import router from "../router";

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
  },
  watch: {},
  computed: {},
  methods: {
    async handleLogin() {
      this.checkFormErrors();

      const formHasErrors = Object.keys(this.formErrors).length > 0;

      if (formHasErrors) return;

      this.sendingLogin = true;
      this.formErrors = {};
      this.apiErrors = "";

      try {
        const response = await axios.post("http://localhost:8000/api/v1/user/login", {
          email: this.email,
          password: this.password,
        });

        Cookies.set("vue-app-session", response.data.authToken, { expires: 7, path: "/" })

        this.resetData();

        router.push("/home")
      } catch (e) {
        if(e instanceof AxiosError){
          console.log(e);
          this.apiErrors = e.response.data.message
          throw new Error(e.message);
        }
      } finally {
        this.sendingLogin = false;
      }
    },
    handlePasswordValue(event) {
      this.password = event;
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

<style lang="scss">
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

  .apiError{
    color: rgb(233, 80, 80);
    text-align: center;
  }
}
</style>

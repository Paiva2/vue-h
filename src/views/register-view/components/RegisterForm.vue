<template>
  <form @submit.prevent="handleRegister" class="register-form">
    <v-btn
      :disabled="sendingRegister"
      class="github-register-btn"
      height="50"
      type="button"
      large
      color="#7c5dfa"
      elevation="5"
    >
      <v-icon class="github-icon" color="#fff" size="30" aria-hidden="false">
        mdi-github
      </v-icon>
      Register with Github
    </v-btn>
    <div class="fields-section">
      <div class="field-wrapper">
        <FormInput
          iconName="mdi-account"
          label="Name"
          holder="Enter your name"
          emitterAlias="name-value"
          v-on:update:name-value="handleNameValue"
        />
        <p v-if="formErrors.name" class="field-error">
          {{ formErrors.name }}
        </p>
      </div>

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

      <div class="field-wrapper">
        <PasswordInput
          label="Confirm Password"
          holder="Confirm your password"
          emitterAlias="password-confirm-value"
          v-on:update:password-confirm-value="handlePasswordConfirmationValue"
        />
        <p v-if="formErrors.passwordConfirmation" class="field-error">
          {{ formErrors.passwordConfirmation }}
        </p>
      </div>
    </div>

    <p>
      Forgot your
      <router-link class="forgot-password-link" to="/forgot-password"
        >password?
      </router-link>
    </p>

    <p v-if="apiSuccess" class="apiSuccess">Registered successully!</p>
    <p v-if="apiErrors" class="apiError">{{ apiErrors }}</p>

    <v-btn
      :loading="sendingRegister"
      :disabled="sendingRegister"
      height="50"
      type="submit"
      large
      color="#7c5dfa"
      elevation="5"
    >
      Register
    </v-btn>

    <p>
      Already has an account?
      <router-link to="/login" class="login-link">
        Sign in!
        <v-icon class="mail-icon" color="#7d5cfa" size="16" aria-hidden="false">
          mdi-open-in-new
        </v-icon>
      </router-link>
    </p>
  </form>
</template>

<script>
import { AxiosError } from "axios";
import FormInput from "../../../components/FormInput.vue";
import PasswordInput from "../../../components/PasswordInput.vue";
import isEmail from "validator/lib/isEmail";
import { mapMutations } from "vuex";
import api from "../../../lib/api";

export default {
  name: "RegisterForm",
  data() {
    return {
      userInfos: {
        email: "",
        name: "",
        password: "",
        passwordConfirmation: "",
      },
      formErrors: {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      },
      apiErrors: "",
      apiSuccess: false,
      sendingRegister: false,
    };
  },
  components: {
    FormInput,
    PasswordInput,
  },
  methods: {
    ...mapMutations(["resetCustomInput"]),
    handleNameValue(event) {
      this.userInfos.name = event;
    },
    handleEmailValue(event) {
      this.userInfos.email = event;
    },
    handlePasswordValue(event) {
      this.userInfos.password = event;
    },
    handlePasswordConfirmationValue(event) {
      this.userInfos.passwordConfirmation = event;
    },
    async handleRegister() {
      this.formErrors = {};
      this.apiErrors = "";

      this.checkFormErrors();

      const formHasErrors = Object.keys(this.formErrors).length > 0;

      if (formHasErrors) return;

      this.sendingRegister = true;

      try {
        await api.post("/api/v1/user/register", this.userInfos);

        this.resetStates();
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);
          this.apiErrors = e.response.data.message;
        }
      } finally {
        this.sendingRegister = false;
        this.formErrors = {};

        setTimeout(() => {
          this.apiSuccess = false;
          this.apiErrors = false;
        }, 4000);
      }
    },
    resetStates() {
      this.apiSuccess = true;
      this.userInfos = {
        email: "",
        name: "",
        password: "",
        passwordConfirmation: "",
      };
      this.apiErrors = "";
      this.resetCustomInput();
    },
    checkFormErrors() {
      const errors = {};

      if (!this.userInfos.name) {
        errors.name = "Name can't be empty.";
      } else if (this.userInfos.name.length < 5) {
        errors.name = "Name must have at least 5 characters.";
      }

      if (!isEmail(this.userInfos.email)) {
        errors.email = "Invalid e-mail.";
      }

      if (!this.userInfos.password) {
        errors.password = "Password can't be empty.";
      } else if (this.userInfos.password.length < 6) {
        errors.password = "Password must have at least 6 characters.";
      }

      if (
        this.userInfos.password !== this.userInfos.passwordConfirmation ||
        !this.userInfos.passwordConfirmation
      ) {
        errors.passwordConfirmation = "Passwords doesn't match.";
      }

      this.formErrors = errors;
    },
  },
};
</script>

<style lang="scss" scoped>
.register-form {
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

  .login-link,
  .forgot-password-link {
    color: #7d5cfa;
    font-weight: 500;
  }

  .github-register-btn {
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

  .apiSuccess {
    text-align: center;
    color: rgb(112, 224, 112);
    font-size: 1.125rem;
    font-weight: 500;
  }
}
</style>

<template>
  <form @submit.prevent="handleForgotPassword" class="forgot-pass-form">
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

    <p v-if="apiSuccess" class="apiSuccess">Registered successully!</p>
    <p v-if="apiErrors" class="apiError">{{ apiErrors }}</p>

    <v-btn
      :loading="sendingForgotPassword"
      :disabled="sendingForgotPassword"
      height="50"
      type="submit"
      large
      color="#7c5dfa"
      elevation="5"
    >
      Submit
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
  </form>
</template>

<script>
import axios, { AxiosError } from "axios";
import FormInput from "../../../components/FormInput.vue";
import PasswordInput from "../../../components/PasswordInput.vue";
import isEmail from "validator/lib/isEmail";
import { mapMutations } from "vuex";

export default {
  name: "ForgotPasswordForm",
  data() {
    return {
      userInfos: {
        email: "",
        password: "",
        passwordConfirmation: "",
      },
      formErrors: {
        email: "",
        password: "",
        passwordConfirmation: "",
      },
      apiErrors: "",
      apiSuccess: false,
      sendingForgotPassword: false,
    };
  },
  components: {
    FormInput,
    PasswordInput,
  },
  methods: {
    ...mapMutations(["resetCustomInput"]),
    handleEmailValue(event) {
      this.userInfos.email = event;
    },
    handlePasswordValue(event) {
      this.userInfos.password = event;
    },
    handlePasswordConfirmationValue(event) {
      this.userInfos.passwordConfirmation = event;
    },
    async handleForgotPassword() {
      this.formErrors = {};
      this.apiErrors = "";

      this.checkFormErrors();

      const formHasErrors = Object.keys(this.formErrors).length > 0;

      if (formHasErrors) return;

      this.sendingForgotPassword = true;

      try {
        await axios.put("http://localhost:8000/api/v1/user/forgot-password", {
          email: this.userInfos.email,
          password: this.userInfos.password,
        });

        this.resetStates();
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);

          this.apiErrors = e.response.data.message;

          throw new Error(e);
        }
      } finally {
        this.sendingForgotPassword = false;
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
        password: "",
        passwordConfirmation: "",
      };
      this.apiErrors = "";
      this.resetCustomInput();
    },
    checkFormErrors() {
      const errors = {};

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
.forgot-pass-form {
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

  .register-link {
    color: #7d5cfa;
    font-weight: 500;
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

<template>
  <v-card class="px-8 py-5">
    <v-progress-linear
      :active="sendingUpdate"
      :indeterminate="sendingUpdate"
      absolute
      top
      color="rgb(124, 93, 250)"
      background-opacity="0.2"
      background-color="#fff"
    ></v-progress-linear>
    <v-card-title class="px-0">
      <span class="text-h5">Profile</span>
    </v-card-title>
    <v-card-text class="px-0"> Edit Profile informations </v-card-text>

    <form @submit.prevent="handleSubmitEdit">
      <div class="form-fields">
        <label class="profile-pic-lbl">
          <span class="overlay">
            <v-icon size="35">mdi-image</v-icon>
          </span>
          <img class="profile-image" :src="handleProfileShow" />
          <input
            @change="handleInputFile"
            accept="image/png, image/jpg, image/jpeg"
            type="file"
            :key="String(newProfilePicture) ?? ''"
          />
        </label>

        <v-text-field
          v-model="formFields.name"
          label="Name"
          :error="formErrors.name"
          hint="Use a name with at least 3 characters"
          color="rgb(124, 93, 250)"
          :value="formFields.name"
        ></v-text-field>

        <v-text-field
          label="E-mail"
          readonly
          :error="false"
          disabled
          :value="userMetadata.email"
        ></v-text-field>

        <v-text-field
          v-model="formFields.password"
          label="Password"
          :error="formErrors.password"
          hint="Use a passsword with at least 6 characters"
          color="rgb(124, 93, 250)"
          :value="formFields.password"
          type="password"
        ></v-text-field>

        <v-text-field
          v-model="formFields.passwordConfirmation"
          label="Confirm Password"
          :error="formErrors.passwordConfirmation"
          color="rgb(124, 93, 250)"
          :value="formFields.passwordConfirmation"
          :disabled="!formFields.password"
          type="password"
          :error-messages="
            formErrors.passwordConfirmation ? `Passwords don't match` : ''
          "
        ></v-text-field>

        <p v-if="updateSuccess" class="apiSuccess">
          Profile updated sucessfully!
        </p>
        <p v-if="updateError" class="apiError">{{ updateError }}</p>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          type="submit"
          color="blue darken-1"
          :disabled="sendingUpdate"
          text
        >
          Save
        </v-btn>
        <v-btn color="red" :disabled="sendingUpdate" text @click="cancel">
          Cancel
        </v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>

<script>
import { AxiosError } from "axios";
import { mapGetters } from "vuex";
import api from "../lib/api";
import store from "../store";
export default {
  name: "EditProfileForm",
  data() {
    return {
      formFields: {
        name: "",
        password: "",
        profilePictureUrl: "",
      },
      formErrors: {
        name: false,
        password: false,
        passwordConfirmation: false,
      },
      newProfilePicture: null,
      sendingUpdate: false,
      updateError: "",
      updateSuccess: false,
    };
  },
  created() {
    this.handleFillForm();
  },
  watch: {
    openProfileForm() {
      this.handleFillForm();
    },
  },
  props: {
    handleOpenProfileForm: Function,
    openProfileForm: Boolean,
  },
  computed: {
    ...mapGetters(["userMetadata"]),
    handleProfileShow() {
      return this.newProfilePicture
        ? URL.createObjectURL(this.newProfilePicture)
        : this.userMetadata.profilePicture
        ? this.userMetadata.profilePicture
        : "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";
    },
  },
  methods: {
    handleFillForm() {
      this.formFields = {
        name: this.userMetadata.name,
        password: "",
        profilePictureUrl: "",
      };
    },
    handleInputFile(event) {
      this.formFields.profilePictureUrl = "";
      this.newProfilePicture = event?.target?.files[0];
    },
    async handleSubmitEdit() {
      this.formErrors = {};
      this.validateErrors();

      const formHasErrors = Object.keys(this.formErrors).length > 0;

      if (formHasErrors) return;

      const bodyRequest = {
        name: this.formFields.name,
        password: this.formFields.password,
        profilePicture: this.newProfilePicture,
      };

      Object.keys(bodyRequest).forEach((field) => {
        if (!bodyRequest[field]) delete bodyRequest[field];

        if (bodyRequest[field] === this.userMetadata[field]) {
          delete bodyRequest[field];
        }
      });

      if (!bodyRequest.password && this.formFields.passwordConfirmation) {
        this.formFields.passwordConfirmation = "";
      }

      if (Object.keys(bodyRequest).length <= 0) return;

      this.sendingUpdate = true;

      try {
        if (this.newProfilePicture) {
          const multipartFile = new FormData();
          multipartFile.append("file", bodyRequest.profilePicture);

          const uploadImage = await api.post(
            "/api/v1/generic/upload-image",
            multipartFile
          );

          bodyRequest.profilePicture = uploadImage.data.url;
        }

        await api.patch("/api/v1/user/update", bodyRequest, {
          headers: {
            Authorization: `Bearer ${this.userMetadata.token}`,
          },
        });

        await store.dispatch("handleUserAuthentication");

        this.newProfilePicture = null;
        this.formFields.profilePictureUrl = bodyRequest.profilePicture;
        this.updateSuccess = true;
      } catch (e) {
        if (e instanceof AxiosError) {
          this.updateError = e.response.data.message;
          console.log(e);
        }
      } finally {
        this.sendingUpdate = false;
        setTimeout(() => {
          this.updateSuccess = false;
          this.updateError = "";
        }, 4000);
      }
    },
    validateErrors() {
      const errors = {};

      if (!this.formFields.name || this.formFields.name?.length < 3) {
        errors.name = true;
      }

      if (this.formFields.password && this.formFields.password?.length < 6) {
        errors.password = true;
      }

      if (
        this.formFields.password &&
        this.formFields.passwordConfirmation !== this.formFields.password
      ) {
        errors.passwordConfirmation = true;
      }

      this.formErrors = errors;
    },
    cancel() {
      this.handleOpenProfileForm();
      this.resetData();
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },
  },
};
</script>

<style lang="scss" scoped>
.form-fields {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  align-items: center;
  justify-content: center;

  &::v-deep {
    .v-input {
      width: 100%;
    }
  }

  .profile-pic-lbl {
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 100%;
    overflow: hidden;
    cursor: pointer;
    position: relative;

    .overlay {
      position: absolute;
      z-index: 1000;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease-in-out;

      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }

    .profile-image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    input {
      display: none;
    }
  }

  .apiSuccess,
  .apiError {
    font-size: 1rem;
    font-weight: 500;
  }

  .apiSuccess {
    color: rgb(112, 224, 112);
  }

  .apiError {
    color: rgb(233, 80, 80);
  }
}
</style>

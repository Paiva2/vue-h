<template>
  <v-dialog v-model="isNewContactFormOpen" max-width="37.5rem" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        @click="handleOpenNewContactForm"
        v-bind="attrs"
        v-on="isNewContactFormOpen && on"
        color="#373c63"
        class="mb-2"
        fab
        dark
        height="2.8125rem"
        width="2.8125rem"
      >
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-progress-linear
        :active="sendingNewContact"
        :indeterminate="sendingNewContact"
        absolute
        top
        color="blue"
        background-opacity="0.2"
        background-color="#fff"
      ></v-progress-linear>

      <v-card-title>
        <span class="text-h5">New contact</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.name"
                label="Contact name"
                :error="formErrors.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.email"
                label="Contact e-mail"
                :error="formErrors.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.phone"
                label="Contact phone"
                :error="formErrors.phone"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <p v-if="apiSuccess" class="apiMessageSuccess">Contact saved!</p>
      <p v-if="apiError" class="apiMessageError">{{ apiError }}</p>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="sendingNewContact"
          color="red darken-1"
          text
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="sendingNewContact"
          color="blue darken-1"
          text
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios, { AxiosError } from "axios";
import { mapGetters } from "vuex";
import isEmail from "validator/lib/isEmail";

export default {
  name: "CreateContact",
  props: {
    handleOpenNewContactForm: Function,
    isNewContactFormOpen: Boolean,
    getContacts: Function,
    pageOptions: Object,
    handleSetCurrentPage: Function,
  },
  data() {
    return {
      formField: {
        name: "",
        email: "",
        phone: "",
      },
      formErrors: {
        name: false,
        email: false,
        phone: false,
      },
      sendingNewContact: false,
      apiError: "",
      apiSuccess: false,
    };
  },

  computed: {
    ...mapGetters(["userMetadata"]),
  },

  methods: {
    async handleRegisterContact() {
      this.apiError = "";
      this.apiSuccess = false;
      this.formErrors = {
        name: false,
        email: false,
        phone: false,
      };

      this.checkFormErrors();

      const formHasErrors = Object.keys(this.formErrors).length > 0;

      if (formHasErrors) return;

      const newContact = {
        name: this.formField.name,
        email: this.formField.email,
        phone: this.formField.phone,
      };

      this.sendingNewContact = true;

      try {
        await axios.post(
          "http://localhost:8000/api/v1/contact/new",
          newContact,
          {
            headers: {
              Authorization: `Bearer ${this.userMetadata.token}`,
            },
          }
        );

        await this.getContacts(
          this.pageOptions.page,
          this.pageOptions.itemsPerPage
        );

        this.apiSuccess = true;

        this.formField = {
          name: "",
          email: "",
          phone: "",
        };
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);
          this.apiErrors = e.response.data.message;
        }
      } finally {
        this.sendingNewContact = false;

        setTimeout(() => {
          this.apiSuccess = false;
          this.apiError = "";
        }, 4000);
      }
    },
    checkFormErrors() {
      const errors = {};

      const { name, email, phone } = this.formField;

      if (!name || name.length < 3) {
        errors.name = true;
      }

      if (!isEmail(email)) {
        errors.email = true;
      }

      if (!phone || phone.length < 5) {
        errors.phone = true;
      }

      this.formErrors = errors;
    },
    save() {
      this.handleRegisterContact();
    },
    close() {
      if (this.sendingNewContact) return;

      this.resetData();
      this.handleOpenNewContactForm();
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },
  },
};
</script>

<style lang="scss" scoped>
.apiMessageSuccess {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(208, 208, 208);
  text-align: center;
}
.apiMessageError {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(233, 80, 80);
  text-align: center;
}
</style>

<template>
  <v-dialog v-model="openEditDialog" max-width="37.5rem" persistent>
    <v-card>
      <v-progress-linear
        :active="sendingEditContact"
        :indeterminate="sendingEditContact"
        absolute
        top
        color="blue"
        background-opacity="0.2"
        background-color="#fff"
      ></v-progress-linear>

      <v-card-title>
        <span class="text-h5">Edit contact</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.name"
                label="Contact name"
                :error="formErrors.name"
                :value="formField.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.email"
                label="Contact e-mail"
                :error="formErrors.email"
                :value="formField.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.phone"
                label="Contact phone"
                :error="formErrors.phone"
                :value="formField.phone"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <p v-if="apiSuccess" class="apiMessageSuccess">Contact edited!</p>
      <template v-if="apiError?.length">
        <p v-for="err in formatApiErrors" :key="err" class="apiMessageError">
          {{ err }}
        </p>
      </template>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="sendingEditContact"
          color="red darken-1"
          text
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="sendingEditContact"
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
import { AxiosError } from "axios";
import { mapGetters } from "vuex";
import isEmail from "validator/lib/isEmail";
import api from "../../../../lib/api";

export default {
  name: "CreateContact",
  props: {
    handleOpenEditContactForm: Function,
    openEditDialog: Boolean,
    getContacts: Function,
    pageOptions: Object,
    contactToEdit: Object,
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
      sendingEditContact: false,
      apiError: "",
      apiSuccess: false,
    };
  },
  watch: {
    openEditDialog() {
      this.formField = {
        ...this.contactToEdit,
      };
    },
  },

  computed: {
    ...mapGetters(["userMetadata"]),
    formatApiErrors() {
      return this.apiError.replace("[", "").replace("]", "").split(",");
    },
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

      const contactEdited = {
        name: this.formField.name,
        email: this.formField.email,
        phone: this.formField.phone,
      };

      Object.keys(contactEdited).forEach((field) => {
        if (!contactEdited[field]) delete contactEdited[field];

        if (this.contactToEdit[field] === this.formField[field]) {
          delete contactEdited[field];
        }
      });

      if (Object.keys(contactEdited).length <= 0) return;

      this.sendingEditContact = true;

      try {
        await api.patch(
          `/api/v1/contact/update/${this.contactToEdit.id}`,
          contactEdited,
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
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);
          this.apiError = e.response.data.message;
          console.log(this.apiError);
        }
      } finally {
        this.sendingEditContact = false;

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
      if (this.sendingEditContact) return;

      this.resetData();
      this.handleOpenEditContactForm({});
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

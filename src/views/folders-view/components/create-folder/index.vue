<template>
  <v-dialog v-model="isNewFolderFormOpen" max-width="37.5rem" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        @click="handleOpenNewFoldForm"
        v-bind="attrs"
        v-on="isNewFolderFormOpen && on"
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
        :active="sendingUpdateFolder"
        :indeterminate="sendingUpdateFolder"
        absolute
        top
        color="rgb(124, 93, 250)"
        background-opacity="0.2"
        background-color="#fff"
      ></v-progress-linear>

      <v-card-title>
        <span class="text-h5">New folder</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-text-field
            v-model="formField.name"
            label="Folder name"
            :error="formErrors.name"
            color="#7c5dfa"
          ></v-text-field>
        </v-container>
      </v-card-text>

      <p v-if="apiError" class="apiMessageError">{{ apiError }}</p>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="sendingUpdateFolder"
          color="red darken-1"
          text
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="sendingUpdateFolder"
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
import api from "../../../../lib/api";

export default {
  name: "CreateFolder",
  props: {
    handleOpenNewFoldForm: Function,
    isNewFolderFormOpen: Boolean,
    getAllFolders: Function,
    pageOptions: Object,
    handleSetCurrentPage: Function,
  },
  data() {
    return {
      formField: {
        name: "",
      },
      formErrors: {
        name: false,
      },
      sendingUpdateFolder: false,
      apiError: "",
    };
  },

  computed: {
    ...mapGetters(["userMetadata"]),
  },

  methods: {
    async handleUpdateFolder() {
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

      const newFolder = {
        name: this.formField.name,
      };

      this.sendingUpdateFolder = true;

      try {
        await api.post("/api/v1/folder/new/", newFolder, {
          headers: {
            Authorization: `Bearer ${this.userMetadata.token}`,
          },
        });

        await this.getAllFolders(
          this.pageOptions.page,
          this.pageOptions.itemsPerPage
        );

        this.formField = {
          name: "",
        };
        this.resetData();
        this.handleOpenNewFoldForm();
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);
          this.apiError = e.response.data.message;
        }
      } finally {
        this.sendingUpdateFolder = false;

        setTimeout(() => {
          this.apiError = "";
        }, 4000);
      }
    },
    checkFormErrors() {
      const errors = {};

      if (!this.formField.name || this.formField.name.length < 3) {
        errors.name = true;
      }

      this.formErrors = errors;
    },
    save() {
      this.handleUpdateFolder();
    },
    close() {
      if (this.sendingUpdateFolder) return;

      this.resetData();
      this.handleOpenNewFoldForm();
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },
  },
};
</script>

<style lang="scss" scoped>
.apiMessageError {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(233, 80, 80);
  text-align: center;
}
</style>

<template>
  <v-dialog v-model="isEditFolderFormOpen" max-width="37.5rem" persistent>
    <v-card>
      <v-progress-linear
        :active="sendingEditFolder"
        :indeterminate="sendingEditFolder"
        absolute
        top
        color="#7c5dfa"
        background-opacity="0.2"
        background-color="#fff"
      ></v-progress-linear>

      <v-card-title>
        <span class="text-h5">Edit folder</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-text-field
            v-model="formField.name"
            label="Folder name"
            :error="formErrors.name"
            :value="formField.name"
            color="#7c5dfa"
          ></v-text-field>
        </v-container>
      </v-card-text>

      <p v-if="apiError" class="apiMessageError">
        {{ apiError }}
      </p>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="sendingEditFolder"
          color="red darken-1"
          text
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="sendingEditFolder"
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
  name: "EditFolder",
  props: {
    handleOpenEditForm: Function,
    isEditFolderFormOpen: Boolean,
    getAllFolders: Function,
    pageOptions: Object,
    folderToEdit: Object,
  },
  data() {
    return {
      formField: {
        name: "",
      },
      formErrors: {
        name: false,
      },
      sendingEditFolder: false,
      apiError: "",
    };
  },
  watch: {
    isEditFolderFormOpen() {
      this.formField = {
        ...this.folderToEdit,
      };
    },
  },

  computed: {
    ...mapGetters(["userMetadata"]),
  },

  methods: {
    async handleEditFolder() {
      this.apiError = "";
      this.apiSuccess = false;
      this.formErrors = {
        name: false,
      };

      this.checkFormErrors();

      const formHasErrors = Object.keys(this.formErrors).length > 0;

      if (formHasErrors) return;

      const folderEdited = {
        name: this.formField.name,
      };

      Object.keys(folderEdited).forEach((field) => {
        if (!folderEdited[field]) delete folderEdited[field];

        if (this.folderToEdit[field] === this.formField[field]) {
          delete folderEdited[field];
        }
      });

      if (Object.keys(folderEdited).length <= 0) return;

      this.sendingEditFolder = true;

      try {
        await api.patch(
          `/api/v1/folder/update/${this.folderToEdit.id}`,
          folderEdited,
          {
            headers: {
              Authorization: `Bearer ${this.userMetadata.token}`,
            },
          }
        );

        await this.getAllFolders(
          this.pageOptions.page,
          this.pageOptions.itemsPerPage
        );

        this.handleOpenEditForm();
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);
          this.apiError = e.response.data.message;
        }
      } finally {
        this.sendingEditFolder = false;

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
      this.handleEditFolder();
    },
    close() {
      if (this.sendingEditFolder) return;

      this.resetData();
      this.handleOpenEditForm();
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

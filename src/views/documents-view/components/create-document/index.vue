<template>
  <v-dialog
    :key="String(isNewDocumentFormOpen)"
    v-model="isNewDocumentFormOpen"
    max-width="37.5rem"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        @click="handleOpenSendDocumentForm"
        v-bind="attrs"
        v-on="isNewDocumentFormOpen && on"
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
        :active="sendingNewDocument"
        :indeterminate="sendingNewDocument"
        absolute
        top
        color="#7c5dfa"
        background-opacity="0.2"
        background-color="#fff"
      ></v-progress-linear>

      <v-card-title>
        <span class="text-h5">Send document</span>
      </v-card-title>

      <v-stepper v-model="currentStep">
        <StepsHeader
          :totalSteps="totalSteps"
          :currentStep="currentStep"
          :contactsSelected="contactsSelected"
          :folderSelected="folderSelected"
        />

        <v-divider></v-divider>

        <v-stepper-items>
          <v-stepper-content
            v-for="step in totalSteps"
            :key="step"
            :step="step"
            class="stepper-content-items"
          >
            <template v-if="currentStep === 1">
              <SelectFolder
                :folderSelected="folderSelected"
                :foldersList="foldersList"
                emitterAlias="updateSelectedFolder"
                v-on:update:updateSelectedFolder="handleFolderSelected"
              />
            </template>

            <template v-if="currentStep === 2">
              <SelectContacts
                :contactsSelected="contactsSelected"
                :contactsList="contactsList"
                emitterAlias="updateSelectedContacts"
                v-on:update:updateSelectedContacts="handleContactsSelected"
              />
            </template>

            <template v-if="currentStep === 3">
              <SelectFile
                :handleOpenDocumentOverview="handleOpenDocumentOverview"
                :file="file"
                emitterAlias="file"
                v-on:update:file="handleChangeFile"
              />
            </template>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn :disabled="cantGoNext" color="#373c63" @click="nextStep">
                Continue
              </v-btn>
              <v-btn color="red darken-1" @click="close" text> Cancel </v-btn>
            </v-card-actions>
          </v-stepper-content>

          <DocumentOverview
            :openDocumentOverview="openDocumentOverview"
            :documentShowing="file"
            :handleOpenDocumentOverview="handleOpenDocumentOverview"
          />
        </v-stepper-items>
      </v-stepper>

      <p v-if="apiError" class="apiMessageError">{{ apiError }}</p>
    </v-card>
  </v-dialog>
</template>

<script>
import { AxiosError } from "axios";
import { mapActions, mapGetters } from "vuex";
import api from "../../../../lib/api";
import DocumentOverview from "../../../../components/DocumentOverview";
import StepsHeader from "./steps-header";
import SelectContacts from "./select-contacts";
import SelectFile from "./select-file";
import SelectFolder from "./select-folder";

export default {
  name: "CreateDocument",
  props: {
    handleOpenSendDocumentForm: Function,
    isNewDocumentFormOpen: Boolean,
    getAllDocuments: Function,
    pageOptions: Object,
    handleSetCurrentPage: Function,
  },
  components: {
    DocumentOverview,
    StepsHeader,
    SelectContacts,
    SelectFile,
    SelectFolder,
  },
  data() {
    return {
      totalSteps: 3,
      currentStep: 1,
      folderSelected: null,
      foldersList: [],
      contactsSelected: [],
      contactsList: [],
      file: null,
      openDocumentOverview: false,
      sendingNewDocument: false,
      apiError: "",
    };
  },

  watch: {
    async isNewDocumentFormOpen() {
      await this.getUserFolders({
        page: 1,
        perPage: 50,
        token: this.userMetadata.token,
        pageOptions: this.pageOptions,
      });

      await this.getUserContacts({
        page: 1,
        perPage: 50,
        token: this.userMetadata.token,
        pageOptions: this.pageOptions,
      });

      this.foldersList = this.listOfFolders;
      this.contactsList = this.listOfContacts;
    },
  },

  computed: {
    ...mapGetters(["userMetadata", "listOfContacts", "listOfFolders"]),
    cantGoNext() {
      const isFolderNonSelected =
        this.currentStep === 1 && !this.folderSelected;

      const isContactsNotSelected =
        this.currentStep === 2 && !this.contactsSelected?.length;

      const isFileNonUploaded = this.currentStep === 3 && !this.file;

      return isFolderNonSelected || isContactsNotSelected || isFileNonUploaded;
    },
  },

  methods: {
    ...mapActions(["getUserContacts", "getUserFolders"]),
    handleChangeFile(payload) {
      this.file = payload;
    },
    handleContactsSelected(payload) {
      this.contactsSelected = payload;
    },
    handleFolderSelected(payload) {
      this.folderSelected = payload;
    },
    handleOpenDocumentOverview() {
      this.openDocumentOverview = !this.openDocumentOverview;

      return this.openDocumentOverview;
    },
    async nextStep() {
      if (this.currentStep < 3) {
        this.currentStep += 1;
      } else {
        await this.handleCreateDocument();
      }
    },
    async handleCreateDocument() {
      if (!this.file) return;

      this.apiError = "";

      const newDocument = new FormData();

      const mapContacts = this.contactsSelected.map((contact) => {
        return {
          id: contact.id,
          email: contact.email,
          phone: contact.phone,
          sendBy: "EMAIL", // Todo: Select send by on client-side
        };
      });

      newDocument.append("document", this.file);
      newDocument.append("contactsForSend", JSON.stringify(mapContacts));

      this.sendingNewDocument = true;

      try {
        await api.post(
          `/api/v1/document/new/${this.folderSelected.id}`,
          newDocument,
          {
            headers: {
              Authorization: `Bearer ${this.userMetadata.token}`,
            },
          }
        );

        await this.getAllDocuments(
          this.pageOptions.page,
          this.pageOptions.itemsPerPage
        );

        this.resetData();
        this.handleOpenSendDocumentForm();
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);
          this.apiErrors = e.response.data.message;
        }
      } finally {
        this.sendingNewDocument = false;

        setTimeout(() => {
          this.apiError = "";
        }, 4000);
      }
    },

    close() {
      if (this.sendingNewDocument) return;

      this.resetData();
      this.handleOpenSendDocumentForm();
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },
  },
};
</script>

<style lang="scss" scoped>
.stepper-header,
.stepper-content-items {
  background-color: #1e1e1e;
}

.pdf-overlay {
  inset: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

<template>
  <div class="view-wrapper">
    <v-list
      class="px-3 py-3 elevation-3 list-wrapper"
      min-height="600"
      subheader
      two-line
    >
      <v-progress-linear
        :active="loadingDocuments"
        :indeterminate="loadingDocuments"
        absolute
        top
        color="#7c5dfa"
        background-opacity="0.2"
        background-color="#fff"
      ></v-progress-linear>

      <div class="list-header">
        <v-subheader class="mb-2 mt-2">
          <CreateDocument
            :handleOpenSendDocumentForm="handleOpenSendDocumentForm"
            :isNewDocumentFormOpen="isNewDocumentFormOpen"
            :getAllDocuments="getAllDocuments"
            :pageOptions="pageOptions"
            :handleSetCurrentPage="handleSetCurrentPage"
          />
        </v-subheader>

        <v-text-field
          clearable
          class="search-field"
          label="Search"
          color="#7c5dfa"
          v-model="searchValue"
          :value="searchValue"
        ></v-text-field>

        <v-btn
          :disabled="!searchValue"
          @click="handleSearch"
          class="mr-4 ml-3 items-center"
          icon
        >
          <v-icon size="25">mdi-magnify</v-icon>
        </v-btn>

        <v-btn v-if="isFiltering" @click.prevent="clearFilters" color="#373c63">
          Clear filters
        </v-btn>
      </div>

      <v-divider class="mb-3"></v-divider>

      <v-list
        v-if="documents.length > 0"
        max-height="550"
        class="documents-list"
      >
        <v-list-item v-for="document in documents" :key="document.id">
          <v-list-item-avatar>
            <v-icon class="grey lighten-1" dark> mdi-file </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ document.fileName }}</v-list-item-title>
            <v-list-item-subtitle
              >{{ document.createdAt }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action class="d-inline-flex flex-row">
            <v-btn @click="handleOpenDeleteDialog(document)" icon>
              <v-icon small> mdi-delete </v-icon>
            </v-btn>

            <v-btn @click="handleOpenDocumentOverview(document)" icon>
              <v-icon small>mdi-eye</v-icon>
            </v-btn>

            <v-btn @click="handleOpenDocumentInfos(document)" icon>
              <v-icon small>mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <ConfirmDeleteDialog
          :openDeleteDialog="openDeleteDialog"
          :closeDelete="closeDelete"
          :deleteItemConfirm="deleteItemConfirm"
          itemDescription="Document"
        />

        <DocumentInfos
          :openDocumentInfos="openDocumentInfos"
          :handleOpenDocumentInfos="handleOpenDocumentInfos"
          :documentShowing="documentShowing"
        />

        <DocumentOverview
          :openDocumentOverview="openDocumentOverview"
          :documentShowing="documentShowing"
          :handleOpenDocumentOverview="handleOpenDocumentOverview"
        />
      </v-list>
      <template v-else>
        <EmptyListFallback icon="mdi-file-question-outline" />
      </template>
    </v-list>

    <div class="text-center pt-2 list-footer">
      <v-pagination
        v-model="pageOptions.page"
        :length="pageOptions.totalPages"
        :value="pageOptions.page"
        color="#373c63"
        total-visible="6"
      ></v-pagination>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="#373c63"
            dark
            v-bind="attrs"
            @click="handleItensPerPageModal"
            v-on="handleItensPerPageModal && on"
            class="per-page-trigger"
          >
            Per page
            <v-icon :class="rotateArrow" class="per-page-arrow">
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>

        <v-list class="per-page-list">
          <v-list-item
            v-for="(option, idx) in pageOptions.perPageOptions"
            :key="idx"
            class="per-page-list-item"
          >
            <v-btn
              :value="pageOptions.itemsPerPage"
              label="Items per page"
              type="number"
              class="per-page-button"
              @click="pageOptions.itemsPerPage = parseInt(option)"
              :disabled="option > pageOptions.totalElements"
            >
              {{ option }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "../../../../lib/api";
import dateFormatter from "../../../../utils/dateFormatter";
import CreateDocument from "../create-document";
import DocumentInfos from "../document-infos";
import ConfirmDeleteDialog from "../../../../components/ConfirmDeleteDialog";
import DocumentOverview from "../../../../components/DocumentOverview";
import EmptyListFallback from "../../../../components/EmptyListFallback";

export default {
  name: "DocumentsList",
  components: {
    CreateDocument,
    DocumentInfos,
    ConfirmDeleteDialog,
    DocumentOverview,
    EmptyListFallback,
  },
  data() {
    return {
      isNewDocumentFormOpen: false,
      openItensPerPageModal: false,
      openDeleteDialog: false,
      loadingDocuments: false,
      openDocumentInfos: false,
      openDocumentOverview: false,
      documentShowing: null,
      searchValue: "",
      documentToDelete: null,
      isFiltering: false,
      pageOptions: {
        page: 1,
        itemsPerPage: 5,
        totalPages: 0,
        totalElements: 0,
        perPageOptions: ["5", "10", "20", "30", "40", "50"],
      },
      documents: [],
    };
  },
  async created() {
    await this.getAllDocuments(
      this.pageOptions.page,
      this.pageOptions.itemsPerPage
    );
  },
  watch: {
    "pageOptions.page": async function () {
      await this.getAllDocuments(
        this.pageOptions.page,
        this.pageOptions.itemsPerPage
      );
    },
    "pageOptions.itemsPerPage": async function () {
      await this.getAllDocuments(
        this.pageOptions.page,
        this.pageOptions.itemsPerPage
      );
    },
  },
  computed: {
    ...mapGetters(["userMetadata"]),
    rotateArrow() {
      return this.openItensPerPageModal ? "rotate-arrow" : "";
    },
  },
  methods: {
    handleOpenDocumentOverview(document) {
      this.openDocumentOverview = !this.openDocumentOverview;
      this.documentShowing = document?.id ? document : null;

      return this.openDocumentOverview;
    },
    handleOpenDocumentInfos(document) {
      this.openDocumentInfos = !this.openDocumentInfos;
      this.documentShowing = document?.id ? document : null;

      return this.openDocumentInfos;
    },
    async handleSearch() {
      await this.getAllDocuments(
        this.pageOptions.page,
        this.pageOptions.itemsPerPage,
        this.searchValue
      );
    },
    closeDelete() {
      this.openDeleteDialog = false;
      this.documentToDelete = null;
    },
    handleOpenDeleteDialog(document) {
      this.openDeleteDialog = !this.openDeleteDialog;
      this.documentToDelete = document;

      return this.openDeleteDialog;
    },
    async clearFilters() {
      await this.getAllDocuments(1, 5, "");
      this.isFiltering = false;
      this.searchValue = "";
    },
    async deleteItemConfirm() {
      try {
        await api.delete(
          `/api/v1/document/delete/${this.documentToDelete.id}`,
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

        this.closeDelete();
      } catch (e) {
        console.log(e);
      }
    },
    async getAllDocuments(page = 1, perPage = 5, filtering = "") {
      this.loadingDocuments = true;

      let endpoint = `/api/v1/document/list?page=${page}&size=${perPage}`;

      if (filtering) {
        endpoint += `&name=${filtering}`;
        this.isFiltering = true;
      }

      try {
        const documentsResponse = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${this.userMetadata.token}`,
          },
        });

        this.documents = documentsResponse.data.documentsList.map(
          (document) => {
            document.createdAt = dateFormatter(new Date(document.createdAt));

            return document;
          }
        );

        const totalPages = Math.ceil(
          documentsResponse?.data?.totalElements / perPage
        );

        const setPage =
          totalPages < documentsResponse.data.page
            ? totalPages
            : this.pageOptions.page;

        this.pageOptions = {
          ...this.pageOptions,
          page: setPage,
          itemsPerPage: perPage,
          totalPages: totalPages,
          totalElements: documentsResponse.data.totalElements,
        };
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingDocuments = false;
      }
    },
    handleOpenSendDocumentForm() {
      this.isNewDocumentFormOpen = !this.isNewDocumentFormOpen;

      return this.isNewDocumentFormOpen;
    },
    handleSetCurrentPage(payload) {
      this.pageOptions.page = payload;
    },
    handleItensPerPageModal() {
      this.openItensPerPageModal = !this.openItensPerPageModal;

      return this.openItensPerPageModal;
    },
  },
};
</script>

<style lang="scss" scoped>
.view-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .documents-list {
    overflow-y: auto;
  }

  .list-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .list-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .list-footer {
    align-items: center;
    justify-content: center;
    position: relative;

    &::v-deep {
      display: flex;
      width: 100%;
      align-items: center;

      .per-page-trigger {
        position: absolute;
        right: 0;
        transition: 0.3s ease-in-out;

        .rotate-arrow {
          transform: rotate(180deg);
        }
      }
    }
  }
}

.v-list.per-page-list {
  padding: 0;

  .per-page-list-item.v-list-item {
    padding: 0;

    min-height: 3.125rem;

    .per-page-button.v-btn {
      width: 100%;
      border-radius: 0;
      min-height: 3.125rem;
    }
  }
}
</style>

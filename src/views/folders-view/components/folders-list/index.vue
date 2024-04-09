<template>
  <div class="view-wrapper">
    <v-list class="px-3 py-3 elevation-3 list-wrapper" subheader two-line>
      <v-progress-linear
        :active="loadingFolders"
        :indeterminate="loadingFolders"
        absolute
        top
        color="rgb(124, 93, 250)"
        background-opacity="0.2"
        background-color="#fff"
      ></v-progress-linear>

      <div class="list-header">
        <v-subheader class="mb-2 mt-2">
          <CreateFolder
            :handleOpenNewFoldForm="handleOpenNewFoldForm"
            :isNewFolderFormOpen="isNewFolderFormOpen"
            :getAllFolders="getAllFolders"
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
      </div>

      <v-divider class="mb-3"></v-divider>

      <v-list max-height="550" class="folders-list">
        <v-list-item v-for="folder in folders" :key="folder.id">
          <v-list-item-avatar>
            <v-icon class="grey lighten-1" dark> mdi-folder </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="folder.name"></v-list-item-title>
            <v-list-item-subtitle
              v-text="folder.createdAt"
            ></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
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
import CreateFolder from "../create-folder";

export default {
  name: "FoldersList",
  data() {
    return {
      isNewFolderFormOpen: false,
      openItensPerPageModal: false,
      loadingFolders: false,
      showSearch: false,
      searchValue: "",
      pageOptions: {
        page: 1,
        itemsPerPage: 5,
        totalPages: 0,
        totalElements: 0,
        perPageOptions: ["5", "10", "20", "30", "40", "50"],
      },
      folders: [],
    };
  },
  async created() {
    await this.getAllFolders(
      this.pageOptions.page,
      this.pageOptions.itemsPerPage
    );
  },
  watch: {
    "pageOptions.page": async function () {
      await this.getAllFolders(
        this.pageOptions.page,
        this.pageOptions.itemsPerPage
      );
    },
    "pageOptions.itemsPerPage": async function () {
      await this.getAllFolders(
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
  components: {
    CreateFolder,
  },
  methods: {
    handleSearch() {
      this.showSearch = !this.showSearch;
    },
    async getAllFolders(page, perPage) {
      this.loadingFolders = true;

      try {
        const foldersResponse = await api.get(
          `/api/v1/folder/all?page=${page}&size=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${this.userMetadata.token}`,
            },
          }
        );

        this.folders = foldersResponse.data.foldersList.map((folder) => {
          folder.createdAt = dateFormatter(new Date(folder.createdAt));

          return folder;
        });

        const totalPages = Math.ceil(
          foldersResponse?.data?.totalElements / perPage
        );

        const setPage =
          totalPages < foldersResponse.data.page
            ? totalPages
            : this.pageOptions.page;

        this.pageOptions = {
          ...this.pageOptions,
          page: setPage,
          itemsPerPage: perPage,
          totalPages: totalPages,
          totalElements: foldersResponse.data.totalElements,
        };
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingFolders = false;
      }
    },
    handleOpenNewFoldForm() {
      this.isNewFolderFormOpen = !this.isNewFolderFormOpen;
    },
    getFolders() {},
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

  .folders-list {
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

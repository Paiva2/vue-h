<template>
  <div class="text-center folder-infos-wrapper">
    <v-dialog scrollable v-model="openFolderInfos" persistent width="500">
      <v-card color="#373c63" class="modal-card-wrapper">
        <v-card-title class="text-h5">
          <v-progress-linear
            :active="loadingFolder"
            :indeterminate="loadingFolder"
            absolute
            top
            color="#7c5dfa"
            background-opacity="0.2"
            background-color="#fff"
          ></v-progress-linear>

          {{ folderFiltered?.name }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-subtitle class="mt-3 pb-0 subtitle-card">
          <strong>Folder id:</strong> {{ folderFiltered?.id }}
        </v-card-subtitle>

        <v-card-subtitle class="subtitle-card">
          <strong>Created at:</strong> {{ folderFiltered?.createdAt }}
        </v-card-subtitle>

        <v-card-subtitle class="subtitle-card">
          <strong>Documents:</strong>
        </v-card-subtitle>
        <div class="documents-list">
          <span
            class="doc-card"
            v-for="doc in folderFiltered?.documents"
            :key="doc?.id"
          >
            <p><strong>Id:</strong> {{ doc.id }}</p>
            <p><strong>Document name:</strong> {{ doc.fileName }}</p>
            <p><strong>Created at:</strong> {{ doc.createdAt }}</p>
            <v-divider></v-divider>
          </span>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="handleOpenFolderInfos" color="red darken-1" text>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "../../../../lib/api";
import dateFormatter from "../../../../utils/dateFormatter";
export default {
  name: "FolderInfos",
  props: {
    openFolderInfos: Boolean,
    handleOpenFolderInfos: Function,
    folderShowing: Object | null,
  },
  data() {
    return {
      loadingFolder: true,
      folderFiltered: null,
    };
  },
  computed: {
    ...mapGetters(["userMetadata"]),
  },
  watch: {
    folderShowing: async function () {
      await this.filterOpenedFolder();
    },
  },
  methods: {
    async filterOpenedFolder() {
      if (!this.folderShowing?.id) return;

      this.loadingFolder = true;

      try {
        const folder = await api.get(
          `/api/v1/folder/${this.folderShowing.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.userMetadata.token}`,
            },
          }
        );

        this.folderFiltered = {
          id: folder.data.id,
          name: folder.data.name,
          createdAt: dateFormatter(new Date(folder.data.createdAt)),
          documents: folder.data.documents.map((doc) => {
            doc.createdAt = dateFormatter(
              new Date(new Date(doc.createdAt).toString())
            );

            return doc;
          }),
        };

        console.log(this.folderFiltered.documents);
      } catch (e) {
      } finally {
        this.loadingFolder = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.documents-list {
  display: flex;
  flex-direction: column;
  max-height: 18.75rem;
  overflow-y: auto;
  padding: 0 24px 20px;

  .doc-card {
    padding-top: 5px;

    &:hover {
      opacity: 0.8;
    }

    &::v-deep {
      p {
        white-space: nowrap;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.v-card__subtitle.subtitle-card {
  padding-bottom: 0;
  font-size: 1rem;
}
</style>

<template>
  <div class="text-center">
    <v-dialog scrollable v-model="openDocumentInfos" persistent width="500">
      <v-card color="#373c63" class="modal-card-wrapper">
        <v-card-title class="text-h5 doc-title">
          <v-progress-linear
            :active="loadingDocument"
            :indeterminate="loadingDocument"
            absolute
            top
            color="#7c5dfa"
            background-opacity="0.2"
            background-color="#fff"
          ></v-progress-linear>

          <p>{{ documentFiltered?.name }}</p>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-subtitle class="mt-3 pb-0 subtitle-card">
          <strong>Document id:</strong> {{ documentFiltered?.id }}
        </v-card-subtitle>

        <v-card-subtitle class="subtitle-card">
          <strong>Created at:</strong> {{ documentFiltered?.createdAt }}
        </v-card-subtitle>

        <v-card-subtitle class="subtitle-card">
          <strong>Contacts receiving:</strong>
        </v-card-subtitle>

        <div class="documents-list">
          <span
            class="doc-card pb-3"
            v-for="attachment in documentFiltered?.documentAttachments"
            :key="attachment?.id"
          >
            <div class="pb-2">
              <p>
                <strong>Contact name:</strong> {{ attachment.contact.name }}
              </p>
              <p>
                <strong>Contact email:</strong> {{ attachment.contact.email }}
              </p>
              <p>
                <strong>Contact phone:</strong> {{ attachment.contact.phone }}
              </p>
            </div>
            <v-divider></v-divider>
          </span>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="handleOpenDocumentInfos" color="red darken-1" text>
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
  name: "DocumentInfos",
  props: {
    openDocumentInfos: Boolean,
    handleOpenDocumentInfos: Function,
    documentShowing: Object | null,
  },
  data() {
    return {
      loadingDocument: true,
      documentFiltered: null,
    };
  },
  computed: {
    ...mapGetters(["userMetadata"]),
  },
  watch: {
    documentShowing: async function () {
      await this.filterOpenedDocument();
    },
  },
  methods: {
    async filterOpenedDocument() {
      if (!this.documentShowing?.id) return;

      this.loadingDocument = true;

      try {
        const document = await api.get(
          `/api/v1/document/${this.documentShowing.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.userMetadata.token}`,
            },
          }
        );

        this.documentFiltered = {
          id: document.data.id,
          name: document.data.fileName,
          createdAt: dateFormatter(new Date(document.data.createdAt)),
          documentAttachments: document.data.documentAttachments,
        };
      } catch (e) {
      } finally {
        this.loadingDocument = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-card-wrapper {
  &::v-deep {
    .doc-title {
      p {
        white-space: nowrap;
        max-width: 100%;
        overflow: hidden;
        font-size: 1.5rem;
        text-overflow: ellipsis;
      }
    }

    .v-card__subtitle.subtitle-card {
      padding-bottom: 0;
    }
  }
}

.documents-list {
  display: flex;
  flex-direction: column;
  max-height: 18.75rem;
  overflow-y: auto;
  padding: 0 2.8125rem 0px;

  .doc-card {
    padding-top: 0.3125rem;

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

<template>
  <div class="text-center">
    <v-dialog
      persistent
      class="dialog-wrapper"
      v-model="openDocumentOverview"
      width="100%"
    >
      <v-card>
        <v-card-title v-if="document?.fileName" class="dialog-title"
          ><p>Document - {{ document?.fileName }}</p>
        </v-card-title>

        <iframe
          :src="document?.documentUrl"
          style="width: 100%; height: 44.375rem; border: none"
          frameborder="0"
          name="Teste"
          allow="fullscreen"
          :title="document?.fileName"
        ></iframe>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="handleOpenDocumentOverview">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DocumentOverview",
  props: {
    openDocumentOverview: Boolean,
    documentShowing: File | Object,
    handleOpenDocumentOverview: Function,
  },
  data() {
    return {
      document: null,
    };
  },
  created() {
    this.setupFile();
  },
  watch: {
    openDocumentOverview() {
      this.setupFile();
    },
  },
  methods: {
    setupFile() {
      this.document = this.documentShowing;

      if (this.document instanceof File) {
        this.document = {
          fileName: "",
          documentUrl: URL.createObjectURL(this.documentShowing),
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-title {
  &::v-deep {
    p {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
    }
  }
}
</style>

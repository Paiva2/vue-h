<template>
  <v-container>
    <v-card-actions v-if="!!fileSelected">
      <v-spacer></v-spacer>
      <v-btn @click="handleOpenDocumentOverview" color="#7c5dfa"> Peek </v-btn>
    </v-card-actions>

    <v-file-input
      v-model="fileSelected"
      placeholder="Upload your document"
      label="File input"
      prepend-icon="mdi-paperclip"
      truncate-length="21"
      hint="Upload only pdf files"
      persistent-hint
      accept="application/pdf"
      @change="handleChangeFile"
    >
      <template v-slot:selection="{ text }">
        <v-chip small label color="#7c5dfa">
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>
  </v-container>
</template>

<script>
export default {
  name: "SelectFile",
  props: {
    handleOpenDocumentOverview: Function,
    emitterAlias: String,
    file: File,
  },
  mounted() {
    this.fileSelected = this.file;
  },
  data() {
    return {
      fileSelected: null,
    };
  },
  methods: {
    handleChangeFile() {
      this.$emit(`update:${this.emitterAlias}`, this.fileSelected);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

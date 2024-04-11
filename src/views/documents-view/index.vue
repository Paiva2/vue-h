<template>
  <div class="documents-container">
    <h1 class="title-page">Documents</h1>

    <DocumentsList />
  </div>
</template>

<script>
import DocumentsList from "../documents-view/components/documents-list";

export default {
  name: "DocumentsView",
  components: {
    DocumentsList,
  },
};
</script>

<style lang="scss" scoped>
.documents-container {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 2.5rem;
  flex-direction: column;

  h1 {
    font-size: 2.1875rem;
    text-transform: uppercase;
  }
}
</style>

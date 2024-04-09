<template>
  <div class="documents-container">
    <h1 class="title-page">Folders</h1>

    <FoldersList />
  </div>
</template>

<script>
import FoldersList from "./components/folders-list";

export default {
  name: "FoldersView",
  components: {
    FoldersList,
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

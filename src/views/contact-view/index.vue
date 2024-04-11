
<template>
  <div class="contacts-wrapper">
    <h1 class="page-title">Contacts</h1>

    <ContactsTable />
  </div>
</template>

<script>
import ContactsTable from "./components/contacts-table";

export default {
  name: "ContactView",
  components: {
    ContactsTable,
  },
};
</script>

<style lang="scss" scoped>
.contacts-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;

  .page-title {
    font-size: 1.875rem;
    text-transform: uppercase;
  }
}
</style>

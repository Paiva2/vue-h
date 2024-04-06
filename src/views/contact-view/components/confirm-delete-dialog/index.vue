<template>
  <v-dialog persistent v-model="openDeleteDialog" max-width="550px">
    <v-card>
      <v-card-title
        class="text-md delete-title-confirmation text-center justify-center"
      >
        Are you sure you want to delete this contact?
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDelete"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="deleteItemConfirm">
          Confirm
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmDeleteDialog",
  props: {
    openDeleteDialog: Boolean,
    closeDelete: Function,
    deleteItemConfirm: Function,
  },
};
</script>

<style lang="scss" scoped>
</style>

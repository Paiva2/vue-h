<template>
  <v-dialog v-model="isNewContactFormOpen" max-width="37.5rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        @click="handleOpenNewContactForm"
        v-bind="attrs"
        v-on="isNewContactFormOpen && on"
        color="#373c63"
        class="mb-2"
        fab
        dark
        height="2.8125rem"
        width="2.8125rem"
      >
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">New contact</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.name"
                label="Contact name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.email"
                label="Contact e-mail"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="formField.phone"
                label="Contact phone"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateContact",
  props: {
    handleOpenNewContactForm: Function,
    isNewContactFormOpen: Boolean,
  },
  data() {
    return {
      formField: {
        name: "",
        email: "",
        phone: "",
      },
    };
  },

  methods: {
    async save() {
      this.handleOpenNewContactForm();
    },
    close() {
      this.handleOpenNewContactForm();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

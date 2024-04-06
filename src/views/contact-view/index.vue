
<template>
  <div class="contacts-wrapper">
    <h1 class="page-title">Contacts</h1>

    <div class="contacts-table">
      <v-data-table
        dark
        :headers="headers"
        :items="contactList"
        :loading="tableItemsLoading"
        :page.sync="pageOptions.page"
        @page-count="pageOptions.totalPages = $event"
        hide-default-footer
        class="elevation-3 contact-table"
        height="37.5rem"
        fixed-header
      >
        <template v-slot:top>
          <v-toolbar flat class="table-toolbar">
            <v-dialog v-model="dialog" max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  @click="handleOpenTableForm"
                  color="#373c63"
                  class="mb-2"
                  fab
                  dark
                  height="45px"
                  width="45px"
                >
                  <v-icon dark> mdi-plus </v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="itemBeeingEdited.name"
                          label="Contact name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="itemBeeingEdited.email"
                          label="Contact e-mail"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="itemBeeingEdited.phone"
                          label="Contact phone"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="550px">
              <v-card>
                <v-card-title class="text-h5">
                  Are you sure you want to delete this contact?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                    Confirm
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-menu class="menu-per-page" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="#373c63"
                  dark
                  v-bind="attrs"
                  @click="handleItensPerPageModal"
                  v-on="handleItensPerPageModal && on"
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
                    :disabled="option >= pageOptions.totalElements"
                  >
                    {{ option }}
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="handleOpenTableForm(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination
          v-model="pageOptions.page"
          :length="pageOptions.pageSize"
          color="#373c63"
          total-visible="6"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios, { AxiosError } from "axios";
import { mapGetters } from "vuex";

export default {
  name: "ContactView",
  data: () => {
    return {
      dialog: false,
      dialogDelete: false,
      tableItemsLoading: false,
      handleOpenItensPerPage: false,
      pageOptions: {
        page: 1,
        itemsPerPage: 5,
        pageSize: 0,
        totalElements: 0,
        perPageOptions: ["5", "10", "20", "30", "40", "50"],
      },
      headers: [
        { text: "Name", value: "name", sortable: false },
        { text: "E-mail", value: "email", sortable: false },
        { text: "Phone", value: "phone", sortable: false },
        { text: "Creation Date", value: "createdAt", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      contactList: [],
      editedIndex: -1,
      itemBeeingEdited: {
        name: "",
        email: "",
        phone: "",
      },
    };
  },

  computed: {
    ...mapGetters(["userMetadata"]),
    rotateArrow() {
      return this.handleOpenItensPerPage ? "rotate-per-page-arrow" : "";
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    "pageOptions.page": function (curr) {
      this.getContacts(curr, this.pageOptions.itemsPerPage);
    },
    "pageOptions.itemsPerPage": function (curr) {
      this.getContacts(this.pageOptions.page, curr);
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    handleItensPerPageModal() {
      this.handleOpenItensPerPage = !this.handleOpenItensPerPage;
    },
    async getContacts(page, perPage) {
      this.tableItemsLoading = true;

      try {
        const requestContacts = await axios.get(
          `http://localhost:8000/api/v1/contact/list-all?page=${page}&size=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${this.userMetadata.token}`,
            },
          }
        );

        const contacts = requestContacts.data;

        this.contactList = contacts.contactsList;
        this.pageOptions = {
          ...this.pageOptions,
          page: contacts.page + 1,
          itemsPerPage: contacts.pageSize,
          pageSize: contacts.totalPages,
          totalElements: contacts.totalElements,
        };
      } catch (e) {
        if (e instanceof AxiosError) {
          console.log(e);
          throw new Error(e.message);
        }
      } finally {
        this.tableItemsLoading = false;
      }
    },
    async initialize() {
      await this.getContacts(
        this.pageOptions.page,
        this.pageOptions.itemsPerPage
      );
    },

    handleOpenTableForm(item) {
      this.editedIndex = this.contactList.indexOf(item);
      this.itemBeeingEdited = {
        name: item.name,
        email: item.email,
        phone: item.phone,
      };
      this.dialog = true;
    },

    deleteItem(item) {
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.closeDelete();
    },

    close() {
      this.dialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    save() {
      this.close();
    },
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
    font-size: 2.1875rem;
    text-transform: uppercase;
  }

  .contacts-table {
    &::v-deep {
      .contact-table {
        max-height: 100%;
      }
    }

    .table-toolbar {
      justify-content: space-between;
      display: flex;
      align-items: center;
      width: 100%;

      &::v-deep {
        .v-toolbar__content {
          justify-content: space-between;
          display: flex;
          align-items: center;
          width: 100%;
        }
      }

      .per-page-arrow {
        transition: 0.3s ease-in-out;

        &.rotate-per-page-arrow {
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

<template>
  <v-container fluid class="px-6">
    <v-select
      v-model="selecteds"
      :items="contactsList"
      label="Select Contacts"
      multiple
      return-object
      item-text="name"
      @input="handleSelectContact"
    >
      <template v-slot:selection="{ index }">
        <template v-if="index === 0">
          <v-chip
            v-for="contact in contactsSelected.slice(0, 4)"
            :key="contact.id"
          >
            <span>{{ contact.name }}</span>
          </v-chip>
        </template>
        <span v-if="index === 4" class="grey--text text-caption">
          (+{{ contactsSelected.length - 4 }} others)
        </span>
      </template>
    </v-select>
  </v-container>
</template>

<script>
export default {
  name: "SelectContacts",
  props: {
    contactsSelected: Array,
    contactsList: Array,
    emitterAlias: String,
  },
  data() {
    return {
      selecteds: [],
    };
  },
  mounted() {
    this.selecteds = this.contactsSelected;
  },
  methods: {
    handleSelectContact() {
      this.$emit(`update:${this.emitterAlias}`, this.selecteds);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

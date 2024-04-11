<template>
  <v-container fluid class="px-6">
    <v-select
      v-model="selected"
      :items="foldersList"
      label="Select folder"
      return-object
      item-text="name"
      @input="handleSelectFolder"
    >
      <template v-slot:selection="{ item, index }">
        <template v-if="index === 0">
          <v-chip>
            <span>{{ item.name }}</span>
          </v-chip>
        </template>
      </template>
    </v-select>
  </v-container>
</template>

<script>
export default {
  name: "SelectFolder",
  props: {
    folderSelected: Object,
    foldersList: Array,
    emitterAlias: String,
  },
  data() {
    return {
      selected: [],
    };
  },
  mounted() {
    this.selected = this.folderSelected;
  },
  methods: {
    handleSelectFolder() {
      this.$emit(`update:${this.emitterAlias}`, this.selected);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

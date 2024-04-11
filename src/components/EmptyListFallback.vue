<template>
  <div class="loading-wrapper">
    <v-icon size="45" color="#fff" class="empty-list-icon">
      {{ icon }}
    </v-icon>

    <h2>Nothing to show here...</h2>
  </div>
</template>

<script>
export default {
  name: "EmptyListFallback",
  props: {
    icon: String,
  },
};
</script>

<style lang="scss" scoped>
.loading-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.125rem;
  align-items: center;
  display: flex;
  flex-direction: column;

  h2 {
    color: #fff;
  }
}
</style>

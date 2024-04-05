<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "League Spartan", sans-serif;
}

#app {
  background-color: #20212b;
}

.container.container--fluid {
  padding: 0;
  min-height: 100%;
}

.v-application p {
  margin: 0 !important;
}

.v-btn__content {
  max-width: 100%;
  max-height: 100%;
}
</style>

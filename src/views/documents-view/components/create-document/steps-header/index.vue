<template>
  <v-stepper-header class="stepper-header">
    <template v-for="step in totalSteps">
      <v-stepper-step
        :key="`${step}-step`"
        :complete="currentStep > step"
        :step="step"
        :editable="canEdit(step)"
        color="#7c5dfa"
      >
        <p v-if="step === 1">Select folder</p>
        <p v-if="step === 2">Select contacts</p>
        <p v-if="step === 3">Select document</p>
      </v-stepper-step>

      <v-divider v-if="step !== 2" :key="step"></v-divider>
    </template>
  </v-stepper-header>
</template>

<script>
export default {
  name: "StepsHeader",
  props: {
    totalSteps: Number,
    currentStep: Number,
    contactsSelected: Array,
    folderSelected: Object,
  },
  methods: {
    canEdit(step) {
      const firstStephasFolder = step === 1 && !!this.folderSelected;

      const secondStepHasContactsSelected =
        step === 2 && this.contactsSelected?.length > 0;

      const firstAndSecondStepsAreOk =
        step === 3 &&
        !!this.folderSelected &&
        this.contactsSelected?.length > 0;

      return (
        firstStephasFolder ||
        secondStepHasContactsSelected ||
        firstAndSecondStepsAreOk
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

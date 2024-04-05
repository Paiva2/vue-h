<template>
  <label class="email-field" :for="label">
    <v-icon class="mail-icon" color="#b4b3b3" size="20" aria-hidden="false">
      {{ iconName }}
    </v-icon>

    {{ label }}

    <input
      v-model="inputValue"
      :id="label"
      type="text"
      :placeholder="holder"
      @change="handleInputValue"
    />
  </label>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      inputValue: "",
    };
  },

  computed: {
    ...mapState(["resetCustomInput"]),
  },
  methods: {
    handleInputValue() {
      this.$emit(`update:${this.emitterAlias}`, this.inputValue);
    },
  },
  watch: {
    resetCustomInput() {
      this.inputValue = "";
    },
  },
  props: {
    iconName: String,
    label: String,
    holder: String,
    emitterAlias: String,
  },
  name: "FormInput",
};
</script>

<style lang="scss" scoped>
.email-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 500;
  position: relative;

  input {
    background-color: #20212b;
    height: 3.125rem;
    border: 0;
    color: #fff;
    font-size: 1rem;
    border-radius: 5px;
    padding-left: 2.5rem;
    font-size: 1.125rem;

    &:active,
    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #b4b3b3;
    }
  }

  .mail-icon {
    position: absolute;
    top: 50px;
    left: 10px;
  }
}
</style>

<template>
  <label class="input">
    <span v-if="title" class="input__title">{{ title }}</span>
    <span class="input-wrapper">
      <input
        class="input__value"
        :class="{ input__value_error: isError }"
        :value="value"
        :type="type"
        :checked="checked"
        v-on="{
          ...$listeners,
          input: (event) => $emit('input', event.target.value),
        }"
      />
      <slot name="icon" />
    </span>
  </label>
</template>

<script>
import InputType from "./types";
export default {
  name: "Input",

  props: {
    isError: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Object, String, Date, Number],
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: InputType.Text,
      validate: (value) => Object.keys(InputType).includes(value),
    },
    checked: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input__value {
  height: 30px;
  width: 100%;
  border: 1px solid grey;
  outline: none;
}

.input__value_error {
  border: 1px solid red;
}

.input-wrapper {
  display: inline-block;
  width: 100%;
  position: relative;
}

.input__title {
  margin-bottom: 10px;
}
</style>

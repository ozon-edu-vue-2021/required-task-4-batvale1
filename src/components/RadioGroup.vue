<template>
  <div class="radio-group">
    <label
      class="radio-group__element"
      v-for="option in options"
      :key="option.value"
    >
      <span class="radio-group__element-caption"> {{ option.label }}</span>
      <span
        class="radio-group__element-view"
        :class="{ 'radio-group__element-view_active': option === value }"
      />
      <Input
        class="radio-group__native-input"
        :type="InputType.Radio"
        :checked="option === value"
        :value="option.value"
        @change="$emit('input', option)"
      />
    </label>
  </div>
</template>

<script>
import Input from "./input";

import InputType from "@/components/input/types.js";

export default {
  name: "RadioGroup",

  components: { Input },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      InputType,
    };
  },
};
</script>

<style scoped>
.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group__element {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-group__element-view {
  width: 20px;
  height: 20px;
  border: 1px solid grey;
  border-radius: 25%;
}

.radio-group__element-view_active {
  background-color: #0456b8;
  border-color: #0456b8;
}

.radio-group__native-input {
  position: absolute;
  left: 0;
  opacity: 0;
  outline: none;
  z-index: -1;
}
</style>

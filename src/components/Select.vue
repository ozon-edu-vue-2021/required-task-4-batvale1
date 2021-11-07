<template>
  <div class="select" v-on-click-outside="closeSelection">
    <Input
      :type="InputType.Text"
      :title="title"
      v-model="computedInputValue"
      @focus="openList"
    >
      <template #icon>
        <span class="select__icon" />
      </template>
    </Input>
    <ul v-if="isOpened && sourceOptions.length" class="select__list">
      <li
        class="select__item"
        v-for="option in sourceOptions"
        :key="option.value"
        @click="handleItemClick(option)"
      >
        {{ option.label }}
      </li>
    </ul>
    <span class="select__empty-list" v-else-if="isOpened">
      {{ localeText.emptyList }}</span
    >
  </div>
</template>

<script>
import Input from "@/components/input";

import onClickOutside from "@/directives/click-outside";

import translations from "@/translations";

import InputType from "@/components/input/types.js";

export default {
  name: "Select",

  components: {
    Input,
  },

  directives: { onClickOutside },

  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Array,
      default: () => [],
    },
    staticOptions: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      InputType,
      isOpened: false,
      filter: "",
    };
  },

  computed: {
    computedInputValue: {
      get() {
        if (!this.isOpened) return this.value.label;

        return this.filter;
      },

      set(value) {
        if (this.isOpened) {
          this.filter = value;
          this.$emit("get-filtered-options", value);
        } else {
          this.$emit(
            "input",
            this.options.find((item) => item.value === value)
          );
        }
      },
    },

    localeText() {
      return {
        emptyList: translations.common.emptyList,
      };
    },

    filteredOptions() {
      if (!this.staticOptions) return [];

      return this.filter
        ? this.options.filter(
            (item) =>
              item.label.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
          )
        : this.options;
    },

    sourceOptions() {
      return this.staticOptions ? this.filteredOptions : this.options;
    },
  },

  methods: {
    openList() {
      this.isOpened = true;
      this.$emit("get-options");
    },

    closeList() {
      this.isOpened = false;
    },

    handleItemClick(option) {
      this.$emit("input", option);
      this.closeList();
    },

    closeSelection() {
      this.filter = "";
      this.closeList();
    },
  },
};
</script>

<style scoped>
.select__icon {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 5px 0 5px;
  border-color: #000 transparent transparent transparent;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.select__list {
  margin: 0;
  width: 100%;
  list-style-type: none;
  border: 1px solid grey;
  padding: 10px 0;
}

.select__item {
  padding: 5px;
  cursor: pointer;
}

.select__item:hover {
  background-color: #62a9ff;
  color: #fff;
}

.select__empty-list {
  padding: 10px 5px;
  width: 100%;
  border: 1px solid grey;
  display: flex;
  align-items: center;
}
</style>

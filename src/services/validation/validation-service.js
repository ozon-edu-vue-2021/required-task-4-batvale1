import Vue from "vue";

export default class ValidationService {
  validation;
  data;
  
  checkFormItem(name) {
    const validation = this.validation[name];
    const value = this.data[name];

    if (validation) {
      Vue.set(this.validation[name], "error", false);

      for (let i = 0; i < validation.checkers.length; i++) {
        const check = validation.checkers[i];

        if (!check(value)) {
          Vue.set(this.validation[name], "error", true);
          break;
        }
      }

      return !validation.error;
    }

    return false;
  }

  checkOverallData(data, validation) {
    this.data = data;
    this.validation = validation;
    let isError = false;
    const fields = Object.keys(this.data);

    fields.forEach((item) => this.checkFormItem(item));

    const errorKeyItem = Object.keys(this.validation).some(
      (key) => this.validation[key].error
    );

    if (errorKeyItem) {
      isError = true;
    }

    return isError;
  }
}

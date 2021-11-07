<template>
  <div class="form" @submit.prevent="sendData">
    <span class="form__title">{{ localeText.personalInfo }}</span>

    <div class="form__section form__name-section_three-columns">
      <Input
        v-model="lastName"
        :title="localeText.lastName"
        :is-error="validation.lastName.error"
      />
      <Input
        v-model="firstName"
        :title="localeText.firstName"
        :is-error="validation.firstName.error"
      />
      <Input
        v-model="secondName"
        :title="localeText.secondName"
        :is-error="validation.secondName.error"
      />
    </div>

    <div class="form__section">
      <Input
        v-model="dataOfBirth"
        :type="service.InputType.Date"
        :title="localeText.dataOfBirth"
        :is-error="validation.dataOfBirth.error"
      />
    </div>

    <div class="form__section form__name-section_one-column">
      <Input
        v-model="email"
        :type="service.InputType.Email"
        :title="localeText.email"
        :is-error="validation.email.error"
      />
    </div>

    <div class="form__section form__name-section_one-column">
      <span class="form__section-title"> {{ localeText.genderTitle }}</span>
      <RadioGroup v-model="gender" :options="genderOptions" />
    </div>

    <span class="form__title">{{ localeText.passportInfo }}</span>

    <div class="form__section">
      <Select
        v-model="citizenship"
        :options="countryOptions"
        :title="localeText.citizenship"
        @get-options="loadCountries"
        @get-filtered-options="loadFilteredCountries"
      />
    </div>

    <div
      v-if="citizenship.value === service.Countries.Russia"
      class="form__section form__name-section_three-columns"
    >
      <Input
        v-model="passportSeries"
        :title="localeText.passportSeries"
        :is-error="validation.passportSeries.error"
      />
      <Input
        v-model="passportNumber"
        :title="localeText.passportNumber"
        :is-error="validation.passportNumber.error"
      />
      <Input
        v-model="passportDate"
        :type="service.InputType.Date"
        :title="localeText.passportDate"
        :is-error="validation.passportDate.error"
      />
    </div>

    <div v-else>
      <div class="form__section form__name-section_two-columns">
        <Input
          v-model="latinLastName"
          :title="localeText.latinLastName"
          :is-error="validation.latinLastName.error"
        />
        <Input
          v-model="latinFirstName"
          :title="localeText.latinFirstName"
          :is-error="validation.latinFirstName.error"
        />
      </div>

      <div class="form__section form__name-section_three-columns">
        <Input
          v-model="passportNumber"
          :title="localeText.passportNumber"
          :is-error="validation.passportNumber.error"
        />
        <Select
          v-model="country"
          :options="countryOptions"
          :title="localeText.countryPassportOrigin"
          @get-options="loadCountries"
          @get-filtered-options="loadFilteredCountries"
        />
        <Select
          v-model="passportType"
          :options="passportOptions"
          :title="localeText.passportType"
          :static-options="true"
        />
      </div>
    </div>

    <div class="form__section form__name-section_one-column">
      <span class="form__section-title">
        {{ localeText.haveCredentialBeenChanged }}</span
      >
      <RadioGroup v-model="lastNameHasBeenChanged" :options="confirmOptions" />
    </div>

    <div
      v-if="lastNameHasBeenChanged.value === service.ConfirmTypes.Yes"
      class="form__section form__name-section_two-columns"
    >
      <Input
        v-model="previousLastName"
        :title="localeText.lastName"
        :is-error="validation.previousLastName.error"
      />
      <Input
        v-model="previousFirstName"
        :title="localeText.firstName"
        :is-error="validation.previousFirstName.error"
      />
    </div>

    <button class="form__submit-btn" @click="sendData">
      {{ localeText.sendData }}
    </button>
  </div>
</template>

<script>
import Input from "@/components/input";
import RadioGroup from "@/components/RadioGroup.vue";
import Select from "@/components/Select.vue";

import { formatDate } from "../utils/format-date-time";
import { debounce } from "@/utils/debounce";

import {
  required,
  validateEmail,
  onlyLatin,
} from "@/services/validation/validation-functions";
import ValidationService from "@/services/validation/validation-service";
import {
  dateTodayAndEarlier,
  exactLength,
  onlyCyrillic,
  onlyNumbers,
} from "../services/validation/validation-functions";

import translations from "@/translations";

import citizenships from "@/assets/data/citizenships.json";
import passportTypes from "@/assets/data/passport-types.json";

import Gender from "@/types/gender";
import Countries from "@/types/countries";
import ConfirmTypes from "@/types/confirm-types";
import InputType from "@/components/input/types";

const countryOptions = citizenships.map((item) => {
  return {
    label: item.nationality,
    value: item.flag,
  };
});

const passportOptions = passportTypes.map((item) => {
  return {
    label: item.type,
    value: item.id,
  };
});

export default {
  name: "Form",

  components: {
    Select,
    Input,
    RadioGroup,
  },

  data() {
    return {
      // validation
      validation: {
        email: {
          checkers: [required, validateEmail],
          error: false,
        },
        firstName: {
          checkers: [required, onlyCyrillic],
          error: false,
        },
        lastName: {
          checkers: [required, onlyCyrillic],
          error: false,
        },
        secondName: {
          checkers: [required, onlyCyrillic],
          error: false,
        },
        previousFirstName: {
          checkers: [required, onlyCyrillic],
          error: false,
        },
        previousLastName: {
          checkers: [required, onlyCyrillic],
          error: false,
        },
        dataOfBirth: {
          checkers: [dateTodayAndEarlier],
          error: false,
        },
        passportDate: {
          checkers: [dateTodayAndEarlier],
          error: false,
        },
        passportSeries: {
          checkers: [required, onlyNumbers, (value) => exactLength(value, 4)],
          error: false,
        },
        passportNumber: {
          checkers: [
            required,
            onlyNumbers,
            this.getPassportNumberValidationRule,
          ],
          error: false,
        },
        latinLastName: {
          checkers: [required, onlyLatin],
          error: false,
        },
        latinFirstName: {
          checkers: [required, onlyLatin],
          error: false,
        },
      },

      // service data
      validationService: null,
      service: {
        InputType,
        Countries,
        ConfirmTypes,
      },
      debouncedCountryLoading: null,

      // content data
      firstName: "",
      secondName: "",
      lastName: "",
      latinLastName: "",
      latinFirstName: "",
      dataOfBirth: formatDate(new Date().toISOString()),
      email: "",
      gender: {},
      citizenship: {},
      country: {},
      passportSeries: "",
      passportNumber: "",
      passportDate: formatDate(new Date().toISOString()),
      passportType: {},
      lastNameHasBeenChanged: {},
      previousLastName: "",
      previousFirstName: "",
      countryOptions: [],
      passportOptions: [],
    };
  },

  computed: {
    localeText() {
      return {
        personalInfo: translations.credentials.personalInfo,
        firstName: translations.credentials.firstName,
        latinFirstName: translations.credentials.latinFirstName,
        secondName: translations.credentials.secondName,
        lastName: translations.credentials.lastName,
        latinLastName: translations.credentials.latinLastName,
        dataOfBirth: translations.credentials.dataOfBirth,
        email: translations.credentials.email,
        genderTitle: translations.credentials.gender,
        genderMale: translations.credentials.genderMale,
        genderFemale: translations.credentials.genderFemale,
        passportInfo: translations.credentials.passportInfo,
        countries: translations.countries,
        passportSeries: translations.credentials.passportSeries,
        passportNumber: translations.credentials.passportNumber,
        passportDate: translations.credentials.passportDate,
        passportType: translations.credentials.passportType,
        citizenship: translations.credentials.citizenship,
        countryPassportOrigin: translations.credentials.countryPassportOrigin,
        haveCredentialBeenChanged:
          translations.credentials.haveCredentialBeenChanged,
        sendData: translations.credentials.sendData,
        yes: translations.common.yes,
        no: translations.common.no,
      };
    },

    confirmOptions() {
      return [
        { value: ConfirmTypes.Yes, label: this.localeText.yes },
        { value: ConfirmTypes.No, label: this.localeText.no },
      ];
    },

    genderOptions() {
      return [
        { value: Gender.Male, label: this.localeText.genderMale },
        { value: Gender.Female, label: this.localeText.genderFemale },
      ];
    },
  },

  async created() {
    await this.fetchData();
    this.initDebouncedHandlers();
    this.setInitialData();
  },

  methods: {
    setInitialData() {
      this.gender = this.genderOptions[0] || {};
      this.country = this.countryOptions[0] || {};
      this.citizenship = this.countryOptions[0] || {};
      this.passportType = this.passportOptions[0] || {};
      this.lastNameHasBeenChanged = this.confirmOptions[0] || {};
    },

    async fetchData() {
      this.countryOptions = countryOptions;
      this.passportOptions = passportOptions;
    },

    initDebouncedHandlers() {
      this.debouncedCountryLoading = debounce(this.loadCountries, 500);
    },

    loadCountries(filter) {
      this.countryOptions = filter
        ? countryOptions.filter(
            (item) =>
              item.label.toLowerCase().indexOf(filter.toLowerCase()) > -1
          )
        : countryOptions;
    },

    loadFilteredCountries(filter) {
      this.debouncedCountryLoading(filter);
    },

    getPassportNumberValidationRule(value) {
      if (this.citizenship.value === Countries.Russia) {
        return exactLength(value, 6);
      }

      return required(value);
    },

    gatherDataToSend() {
      let fields = {
        firstName: this.firstName,
        secondName: this.secondName,
        lastName: this.lastName,
        dataOfBirth: this.dataOfBirth,
        email: this.email,
        gender: this.gender.value,
        citizenship: this.citizenship.value,
        passportNumber: this.passportNumber,
      };

      if (this.citizenship.value !== Countries.Russia) {
        fields = {
          ...fields,
          ...{
            latinLastName: this.latinLastName,
            latinFirstName: this.latinFirstName,
            country: this.country.value,
            passportType: this.passportType.value,
          },
        };
      } else {
        fields = {
          ...fields,
          ...{
            passportDate: this.passportDate,
            passportSeries: this.passportSeries,
          },
        };
      }

      if (this.lastNameHasBeenChanged.value === ConfirmTypes.Yes) {
        fields = {
          ...fields,
          ...{
            previousLastName: this.previousLastName,
            previousFirstName: this.previousFirstName,
          },
        };
      }

      return fields;
    },

    validateForm(data) {
      this.validationService = new ValidationService(data, this.validation);

      return this.validationService.checkOverallData();
    },

    sendData() {
      const dataToSend = this.gatherDataToSend();
      const hasError = this.validateForm(dataToSend);

      if (!hasError) {
        console.log(dataToSend);
      }
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 600px;
}

.form__section {
  display: grid;
  gap: 20px;
  margin-top: 20px;
  grid-template-columns: 280px;
}

.form__section-title {
}

.form__name-section_three-columns {
  grid-template-columns: repeat(3, 1fr);
}

.form__name-section_two-columns {
  grid-template-columns: repeat(2, 1fr);
}

.form__name-section_one-column {
  grid-template-columns: 1fr;
}

.form__title {
  font-size: 26px;
  font-weight: bold;
  padding: 20px;
  display: inline-block;
}

.form__submit-btn {
  margin-top: 30px;
}
</style>

import { getDate } from "../../utils/format-date-time";

export const required = function (value) {
  return Boolean(value);
};

export const validateEmail = function (value) {
  // TODO: just a simple regex (not for all cases), for real task it should be done correctly
  const re = /\S+@\S+\.\S+/;

  return re.test(value);
};

export const minLength = function (value, length) {
  return value.length >= length;
};

export const maxLength = function (value, length) {
  return value.length <= length;
};

export const exactLength = function (value, length) {
  return minLength(value, length) && maxLength(value, length);
};

export const onlyCyrillic = function (value) {
  const re = /^[а-яА-Я]+$/;

  return re.test(value);
};

export const onlyLatin = function (value) {
  const re = /^[a-zA-Z]+$/;

  return re.test(value);
};

export const onlyNumbers = function (value) {
  const re = /^[0-9]+$/;

  return re.test(value);
};

export const dateTodayAndEarlier = function (value) {
  if (!value) return false;

  const date = getDate(value).ts;
  const currentDate = new Date().getTime();

  return date <= currentDate;
};

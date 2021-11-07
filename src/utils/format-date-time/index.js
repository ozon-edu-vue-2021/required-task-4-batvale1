import { DateTime } from "luxon";

import DateTimeFormats from "./types";

export function formatDate(isoTime, format = DateTimeFormats.fullDate) {
  return DateTime.fromISO(isoTime).toFormat(format);
}

export function getDate(isoTime) {
  return DateTime.fromISO(isoTime);
}

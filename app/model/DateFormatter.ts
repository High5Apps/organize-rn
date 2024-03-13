const LOCALE = 'en-US';

type DateFormat = 'full' | 'dateOnlyShort';

export default function formatDate(date: Date, format: DateFormat) {
  let options: Intl.DateTimeFormatOptions;
  if (format === 'full') {
    options = {
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      weekday: 'short',
      year: 'numeric',
    };
  } else if (format === 'dateOnlyShort') {
    options = { dateStyle: 'short' };
  } else {
    throw new Error('Unrecognized date format');
  }

  return date.toLocaleString(LOCALE, options);
}

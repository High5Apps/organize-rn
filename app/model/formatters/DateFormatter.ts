import i18n from '../../i18n';

type DateFormat = 'full' | 'dateOnlyShort' | 'fullFileName';

export default function formatDate(date: Date, format: DateFormat) {
  const { language } = i18n;

  if (format === 'full') {
    return date.toLocaleString(language, {
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      weekday: 'short',
      year: 'numeric',
    });
  }

  if (format === 'dateOnlyShort') {
    return date.toLocaleString(language, {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    });
  }

  if (format === 'fullFileName') {
    const year = date.getFullYear();
    const month = String(1 + date.getMonth()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  throw new Error('Unrecognized date format');
}

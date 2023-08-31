type Props = {
  maxLength: number;
  text: string;
};

export const SINGLE_CHARACTER_ELIPSIS = '…';

export default function truncate({ maxLength, text }: Props) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncatedText = text.slice(0, maxLength - 1);
  return `${truncatedText}${SINGLE_CHARACTER_ELIPSIS}`;
}

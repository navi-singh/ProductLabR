export function truncateText(title: string, text: string, wordLimit: number): string {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
}


export function truncateTextByCharacters(title: string, text: string, wordLimit: number): string {
    const titleLength = title.length;
    const maxTextLength = wordLimit - titleLength;
    if (maxTextLength <= 0) {
        return '';
    }
    return text.slice(0, maxTextLength);
}
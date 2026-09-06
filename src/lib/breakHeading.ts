/**
 * Converts a heading string to multi-line by inserting newlines at natural word boundaries.
 * Handles content from CMS that may or may not already contain \n.
 * Targets ~4-6 words per line for headings over 4 words.
 */
export function breakHeading(text: string): string {
  if (!text) return '';
  if (text.includes('\n')) return text;

  const words = text.split(' ');
  if (words.length <= 4) return text;

  const lines: string[] = [];
  let currentLine: string[] = [];

  for (const word of words) {
    currentLine.push(word);
    if (currentLine.length >= 3) {
      lines.push(currentLine.join(' '));
      currentLine = [];
    }
  }
  if (currentLine.length > 0) lines.push(currentLine.join(' '));
  return lines.join('\n');
}

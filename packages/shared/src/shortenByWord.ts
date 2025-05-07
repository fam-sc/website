const DELIMITER_REGEX = /[\s.,;:()[\]]/;

// Shortens the input to be near the given limit.
// Tries to end at the end of the word at 'limit' position.
// That way the result is: shortenByWord('hello world one', 8) = 'hello world' instead of
// 'hello world one'.slice(0, 8) = 'hello wo'
export function shortenByWord(input: string, limit: number): string {
  if (input.length <= limit) {
    return input;
  }

  const delimiterIndex = input.slice(limit).search(DELIMITER_REGEX);
  if (delimiterIndex < 0) {
    return input;
  }

  return input.slice(0, limit + delimiterIndex).trimEnd();
}

const SLUG_PATTERN = /^[a-z\d\-_]+$/i;

export function isValidSlug(value: string) {
  return SLUG_PATTERN.test(value);
}

const TRANSLITERATION_MAP: Record<
  string,
  string | { first: string; other: string } | undefined
> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: { first: 'ye', other: 'ie' },
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: { first: 'yi', other: 'i' },
  й: { first: 'y', other: 'i' },
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ю: { first: 'yu', other: 'iu' },
  я: { first: 'ya', other: 'ia' },
};

const PUNCTUATION = new Set(['.', ',', ' ']);

function getSlugReplacement(value: string, isFirst: boolean): string | null {
  const code = value.codePointAt(0);

  // Check if chat is a letter, digit, - or _.
  if (
    code !== undefined &&
    ((code >= 97 && code <= 122) ||
      (code >= 48 && code <= 57) ||
      value == '-' ||
      value === '_')
  ) {
    return value;
  }

  const info = TRANSLITERATION_MAP[value];
  if (info !== undefined) {
    if (typeof info === 'string') {
      return info;
    } else {
      return isFirst ? info.first : info.other;
    }
  }

  if (PUNCTUATION.has(value)) {
    return '-';
  }

  return null;
}

function normalizeDashes(value: string): string {
  return value.replaceAll(/-+/g, '-');
}

export function textToSlug(value: string) {
  value = value.toLowerCase().trim();

  let result = '';
  let isFirst = true;

  for (const c of value) {
    const replacement = getSlugReplacement(c, isFirst);

    if (replacement !== null) {
      isFirst = false;
      result += replacement;
    }
  }

  return normalizeDashes(result);
}

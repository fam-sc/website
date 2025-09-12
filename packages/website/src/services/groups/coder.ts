const encodeMap: Record<string, string> = {
  К: 'K',
  М: 'M',
  В: 'V',
  П: 'P',
};

const decodeMap: Record<string, string> = {
  K: 'К',
  M: 'М',
  V: 'В',
  P: 'П',
};

export function encodeGroup(name: string) {
  return name.replaceAll(/К|М|В|П/g, (value) => encodeMap[value]);
}

export function decodeGroup(name: string) {
  return name.replaceAll(/K|M|V|P/g, (value) => decodeMap[value]);
}

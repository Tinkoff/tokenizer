import domain, { email } from './domain';

function index(match: any[]) {
  return match.findIndex((x, i) => x && i) - 1;
}

export type Token = { type: string; value: string };

const omitFalsy = (obj: Record<string, any>) =>
  Object.keys(obj).reduce((mem, key) => {
    if (obj[key]) {
        mem[key] = obj[key];
    }
    return mem;
  }, {} as Record<string, any>);

export function tokenizer(str: string, tokensParam: { [x: string]: string } = {}) {
  const tokens = {
    domain: domain.source,
    ...omitFalsy(tokensParam),
  };
  const exp = new RegExp(
    `${Object.values(tokens)
      .map((x) => `(${x})`)
      .join('|')}`,
    domain.unicode == null ? 'gi' : 'giu'
  );
  const groups = Object.keys(tokens);

  let res;
  let lastIndex = 0;
  const result: Token[] = [];
  while ((res = exp.exec(str))) {
    let { index: nextIndex } = res;
    if (lastIndex != nextIndex) {
      result.push({ type: 'text', value: str.slice(lastIndex, nextIndex) });
    }
    let type = groups[index(res)];
    const value = res[index(res) + 1];
    if (type === 'domain') {
      if (email.test(value)) {
        type = 'email';
      }
    }
    result.push({ type, value });
    lastIndex = nextIndex + value.length;
  }
  if (lastIndex != str.length) {
    result.push({ type: 'text', value: str.slice(lastIndex, str.length) });
  }
  return result;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function oneOf(list: string[]) {
  return list.sort((a, b) => b.length - a.length).map(escapeRegExp).join('|');
}

export const print = (tokens: Token[]) => tokens.map((x) => `"${x.value}" (${x.type})`).join('  ');

import domain, { email } from './domain';
import { PriorityQueue } from './PriorityQueue';

export type Token = { type: string; value: string };

const omitFalsy = (obj: Record<string, any>) =>
  Object.keys(obj).reduce((mem, key) => {
    if (obj[key]) {
      mem[key] = obj[key];
    }
    return mem;
  }, {} as Record<string, any>);

type TokenPointer = { type: string; regex: RegExp; res: RegExpExecArray };

export function tokenizer(str: string, tokensParam: { [x: string]: RegExp | string } = {}) {
  domain.lastIndex = 0;
  email.lastIndex = 0;
  const tokens: Record<string, RegExp> = {
    domain: domain,
    ...omitFalsy(tokensParam),
  };
  const q = new PriorityQueue<TokenPointer>();

  Object.keys(tokens).forEach((tokenKey) => {
    const tokenRegEx = new RegExp(
      tokens[tokenKey],
      Array.from(new Set([...(tokens[tokenKey].flags || '').split(''), 'g'])).join('')
    );
    const res = tokenRegEx.exec(str);
    if (res) {
      q.push({ type: tokenKey, regex: tokenRegEx, res }, res.index);
    }
  });

  let token;
  let lastIndex = 0;
  const result: Token[] = [];
  while ((token = q.shift())) {
    let { index: nextIndex } = token.res;
    if (nextIndex >= lastIndex) {
      if (lastIndex != nextIndex) {
        result.push({ type: 'text', value: str.slice(lastIndex, nextIndex) });
      }
      let type = token.type;
      const value = token.res[0];
      if (type === 'domain') {
        if (email.test(value)) {
          type = 'email';
        }
      }
      result.push({ type, value });
      lastIndex = nextIndex + value.length;
    } else {
      token.regex.lastIndex = lastIndex;
    }

    const res = token.regex.exec(str);
    if (res) {
      q.push({ type: token.type, regex: token.regex, res }, res.index);
    }
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
  if (!list.length) {
    return undefined;
  }
  return new RegExp(list
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|'), 'ig');
}

export const print = (tokens: Token[]) => tokens.map((x) => `"${x.value}" (${x.type})`).join('  ');

import domain from "./domain";

function index(match: any[]) {
  return match.findIndex((x, i) => x && i) - 1;
}

export type Token = { type: string; value: string };

export function tokenizer(str: string, tokensParam: { [x: string]: string } = {}) {
    const tokens = {
        domain: domain.source,
        ...tokensParam
    }
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

    result.push({ type: groups[index(res)], value: res[index(res) + 1] });
    lastIndex = nextIndex + res[index(res) + 1].length;
  }
  if (lastIndex != str.length) {
      result.push({ type: 'text', value: str.slice(lastIndex, str.length) });
  }
  return result;
}

export const print = (tokens: Token[]) => tokens.map(x => `"${x.value}" (${x.type})`).join('  ')
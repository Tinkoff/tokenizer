# tokenizer
Library to find urls, mentions, hashtags and more.

## installation
```
npm i @tinkoff/tokenizer
```

## API
```ts
type Token = { type: string; value: string };

// to specify custom tokens 
// you can pass optional param with your own RegExp (as string only)
// ⚠️IMPORTANT! Do not use capturing groups. Use non-capturing groups "(?:)" instead
type Params = { [token: string]: string }; // e.g. { hashtag: '#[a-z]+' }

function tokenizer(str: string, tokensParam: Params[]): Token[];

```


## examples
```ts
import { tokenizer, print } from '@tinkoff/tokenizer';

const textToParse = `
text containing some links like example.com or 
more strict links with protocol https://google.com;
maybe some unicode written urls like сайт.рф К)
or even a link with hash vk.com/#antient/route
also you can parse custom tokens like {$MAC} and {$CHEESE} 
it's easy to mention @someone and get it parsed as well
at last but not least #hashtags should also work fine.
`;


const result = tokenizer(textToParse, {
    tag: '\\{\\$MAC\\}|\\{\\$CHEESE\\}',
    hashtag: '#[a-z]+',
    user: '[@][a-z]+'
})

console.log(print(result));
```

outputs:

```text
"
text containing some links like " (text)  "example.com" (domain)  " or 
more strict links with protocol " (text)  "https://google.com" (domain)  ";
maybe some unicode written urls like " (text)  "сайт.рф" (domain)  " К)
or even a link with hash " (text)  "vk.com/#antient/route" (domain)  "
also you can parse custom tokens like " (text)  "{$MAC}" (tag)  " and " (text)  "{$CHEESE}" (tag)  " 
it's easy to mention " (text)  "@someone" (user)  " and get it parsed as well
at last but not least " (text)  "#hashtags" (hashtag)  " should also work fine.
" (text)
```
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


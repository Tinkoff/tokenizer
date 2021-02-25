import tlds from './tlds';

const unicodeSupported = new RegExp('').unicode != null;
const protocol = /(?:(?:[A-z]+:)?\/\/)?/.source;
const auth = /(?:\S+(?::\S*)?@)?/.source;
const username = /(?:[^\s:@/?#]+@)/.source;
const host =
unicodeSupported
    ? /(?:(?:[\p{L}0-9][-_]*)*[\p{L}0-9]+)/u.source
    : /(?:(?:[a-z\u00a1-\uffff0-9][-_]*)*[a-z\u00a1-\uffff0-9]+)/.source;
const domain = /(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*/.source;
const tld = `(?:\\.(?:${tlds.sort((a, b) => b.length - a.length).join('|')}))`;
const port = /(?::\d{2,5})?/.source;
const path = /(?:[\/?#](?:(?:(?![:?\[.),;!"']*\s).)*(?:(?![:?\[.),;!"']*\s)[^:?\[.),;!"']))?)?/.source;
const regex = `\\b(?:${protocol}|www\\.)${auth}(?:localhost|${host}${domain}${tld})${port}${path}\\b`;

export const email = new RegExp(`^${username}${host}${domain}${tld}$`, 'gu');

export default new RegExp(regex, unicodeSupported ? 'gu' : 'g');

import tlds from 'tlds';

const unicodeSupported = new RegExp('').unicode != null;
const protocol = `(?:(?:[a-z]+:)?//)?`;
const auth = '(?:\\S+(?::\\S*)?@)?';
const host =
unicodeSupported
    ? '(?:(?:[\\p{L}0-9][-_]*)*[\\p{L}0-9]+)'
    : '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
const tld = `(?:\\.(?:${tlds.sort((a, b) => b.length - a.length).join('|')}))`;
const port = '(?::\\d{2,5})?';
const path = `(?:[\\/?#](?:(?![:?[.:,;?!"']?\\s).)*)?`;
const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${host}${domain}${tld})${port}${path}`;

export default new RegExp(regex, unicodeSupported ? 'igu' : 'ig');
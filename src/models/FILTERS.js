import { escapeRegExp } from '@/models/utils';
import XRegExp from "xregexp";

const PUNCTUATION = '",;!?¡¿⸘‽/()';
// const LETTER_SYMBOLS = 'Ꝛꝛ';
// const ENGLISH_ACCENTS = 'áéíóú àèìòù âêîôû äëïöü ãñ ç ʻ';

const UNICODE_ACCENTS = [
  ...[
    'Latin1Supplement',
    'LatinExtendedA',
    'IPA Extensions',
    'LatinExtendedB',
  ].map(b => `\\p{In${b}}`),
  'Ά-ΐ', 'Ϊ-ΰ', 'ϊ-Ͽ', 'ͰͱͲͳͶͷͻͼͽͿ', // Greek
  'Ѐ-ЏЙйѐ-ӿ', // Cyrillic
].join('');
const UNICODE_ACCENT_REGEXP = XRegExp(`[${UNICODE_ACCENTS}]`);
const UNICODE_ACCENT_INITIAL_REGEXP = XRegExp(`^[${UNICODE_ACCENTS}]`);


const ACCENTS_RARE = [
  'LatinExtendedA',
  'IPA Extensions',
  'LatinExtendedB',
].map(b => `\\p{In${b}}`).join('');
const ACCENTS_RARE_REGEX = XRegExp(`[${ACCENTS_RARE}]`);

// const UNICODE_ACCENT_REGEXP = /[^a-zα-ωа-я ,.]/i;
// const UNICODE_ACCENT_INITIAL_REGEXP = /^[^a-zα-ωа-я]/i;

const alliterativeRegExp =  new RegExp('^(.).+\\1');

const FILTERS = [
  /* positive filters (Look for) */
  {
    label: "alliterative (A.*a.*)", type: 'boolean', default: false, activeWhen: true, kind: 'positive',
    info: "Look for words with internal alliteration that can be used to show off the uppercase and lowercase of a letter.",
    // wordFilter: w => new RegExp('.+' + w[0]).test(w)
    wordFilter: w => alliterativeRegExp.test(w)
  },
  {
    label: 'accents', default: false, activeWhen: true, kind: 'positive',
    wordFilter: w => UNICODE_ACCENT_REGEXP.test(w),
  },
  {
    label: 'rare accents', default: false, activeWhen: true, kind: 'positive',
    wordFilter: w => ACCENTS_RARE_REGEX.test(w),
  },
  {
    label: 'accented first letter', default: false, activeWhen: true, kind: 'positive',
    wordFilter: w => UNICODE_ACCENT_INITIAL_REGEXP.test(w),
  },

  /* Negative filters (Filter out) */
  {
    label: 'digits', default: true, activeWhen: true, kind: 'negative',
    disallowedSequence: '[0-9]'
  },
  {
    label: 'hyphen', default: true, activeWhen: true, kind: 'negative',
    disallowedSequence: '-'
  },
  {
    label: "period", default: true, activeWhen: true, kind: 'negative',
    disallowedSequence: '\\.',
  },
  {
    label: 'acronyms', default: true, activeWhen: true, kind: 'negative',
    disallowedSequence: '[A-Z][A-Z]'
  },
  {
    label: 'phrases', default: true, activeWhen: true, kind: 'negative',
    disallowedSequence: '[ ' + escapeRegExp(PUNCTUATION) + ']'
  },
  {
    label: 'apostrophe', default: false, activeWhen: true, kind: 'negative',
    disallowedSequence: "'",
  },
  {
    label: 'accents', default: false, activeWhen: true, kind: 'negative',
    wordFilter: w => !UNICODE_ACCENT_REGEXP.test(w),
  },
];

export default FILTERS;
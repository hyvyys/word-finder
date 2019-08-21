import { objectFromArray, escapeRegExp, isRegExpValid } from './utils';
import XRegExp from "xregexp";
import ISO6391 from "iso-639-1";
const languages = ISO6391.getAllNames().sort()


const UNICODE_ACCENT_BLOCKS = [
  'Latin1Supplement',
  'LatinExtendedA',
  'LatinExtendedB',
];
const UNICODE_ACCENT_REGEXP = XRegExp('[' +
  UNICODE_ACCENT_BLOCKS.map(b => `\\p{In${b}}`).join('')
  + ']');
const UNICODE_ACCENT_INITIAL_REGEXP = XRegExp('^[' +
  UNICODE_ACCENT_BLOCKS.map(b => `\\p{In${b}}`).join('')
  + ']');

const PUNCTUATION = escapeRegExp('\'.-",;!?¡¿⸘‽');
const PUNCTUATION_REGEXP = new RegExp('[' + PUNCTUATION + ']');

const LETTER_SYMBOLS = 'Ꝛꝛ';
const LETTER_SYMBOLS_REGEXP = new RegExp('[' + LETTER_SYMBOLS + ']');

const ENGLISH_ACCENTS = 'áéíóú àèìòù âêîôû äëïöü ãñ ç ʻ';
const ENGLISH_ACCENTS_REGEXP = new RegExp('['
  + ENGLISH_ACCENTS.replace(/ /g, '')
  + ']', 'i');
const ENGLISH_ACCENTS_INITIAL_REGEXP = new RegExp('^['
  + ENGLISH_ACCENTS.replace(/ /g, '')
  + ']', 'i');

const NON_ENGLISH_EXTENDED_REGEXP = new RegExp('[^0-9a-z'
  + PUNCTUATION
  + LETTER_SYMBOLS
  + ENGLISH_ACCENTS.replace(/ /g, '')
  + ']', 'i');


export const letteringOptions = [
  // formatting options
  { prop: "capitalize", type: 'boolean', form: 'toggle', default: true, format: true },


  // filters hidden from GUI
  {
    prop: 'prefixes', type: 'boolean', default: false, activeOnFalse: true,
    if: () => false, // hide from gui
    wordFilter: w => !/-$/.test(w)
  },

  {
    prop: 'suffixes', type: 'boolean', default: false, activeOnFalse: true,
    if: () => false, // hide from gui
    letterFilter: ({ letter: l }) => !/\-/.test(l)
  },
  
  
  // filters vivisble in GUI
  {
    prop: "languages",
    type: 'select',
    multiple: true,
    default: ['Spanish', 'Slovak', 'German', 'Swedish'],
    filter: filterLanguages,
    // display selected options first for easy deselecting
    optionsFunc: value => [
      ...languages.filter(l => value.includes(l)),
      ...languages.filter(l => !value.includes(l))
    ],
    if: options => options.multiple,
    compute: o => o.multiple ? o.languages : [o.language],
    labelToggles: [ "multiple" ],
    parse: true,
  },
  {
    prop: "language",
    type: 'select',
    multiple: false,
    default: 'English',
    filter: filterLanguages,
    options: languages,
    if: options => !options.multiple,
    labelToggles: [ "multiple" ],
  },


  { prop: "multiple", type: 'boolean', default: false, if: () => false },

  {
    prop: "minLength", type: 'number', default: 4, min: 1, max: 1000,
    wordFilterFunc: minLength => w => w.length >= minLength
  },

  {
    prop: "maxLength", type: 'number', default: 14, min: 1, max: 1000,
    wordFilterFunc: maxLength => w => w.length <= maxLength
  },

  {
    prop: "search", type: 'string', default: '',
    info: 'Regular expressions supported (JavaScript flavor).',
    wordFilterFunc: regex => w => regex.test(w),
    labelToggles: ["isSearchRegex", "isSearchCaseSensitive"],
    compute: o => o.isSearchRegex
      ? new RegExp(o.search, o.isSearchCaseSensitive ? '' : 'i')
      : new RegExp(escapeRegExp(o.search), o.isSearchCaseSensitive ? '' : 'i'),
    validate: o => o.isSearchRegex ? isRegExpValid(o.search) : true,
  },
  { prop: "isSearchRegex", label: "Regex", type: 'boolean', default: true, if: () => false },
  { prop: "isSearchCaseSensitive", label: "Case", type: 'boolean', default: false, if: () => false },

  {
    prop: "doubleLetter",
    label: "First letter repeated",
    if: options => false,
    type: 'boolean',
    default: false,
    info: "Look for words that can be used to show off both uppercase and lowercase of their first letter."
    // filter: 
    // const doubleLetter = '^' + letter + '.*' + letter + '.*' + '$';
  },

  {
    prop: 'collapseAccents', type: 'boolean', default: false,
    parse: true,
    info: 'Before drawing a word, merge words starting with a diacritic with words starting with corresponding base letter.',
  },

  {
    prop: 'phrases', type: 'boolean', default: false, activeOnFalse: true,
    wordFilter: w => !/ /.test(w)
  },

  {
    prop: "repeatedFirstLetter",
    type: 'boolean',
    default: false,
    info: "Look for words that can be used to show off both uppercase and lowercase of their first letter.",
    wordFilter: w => new RegExp('.+' + w[0] + '.*').test(w)
  },

  {
    prop: 'accentedFirstLetter', type: 'boolean', default: false, activeOnFalse: true,
    compute: options => !englishOnly(options) || options.accentedFirstLetter,
    if: options => englishOnly(options),
    letterFilter: ({ letter: l }) => !UNICODE_ACCENT_REGEXP.test(l),
    info: 'When unchecked, filters out words starting with a diacritic.',
  },

  {
    prop: 'uncommonAccents', type: 'boolean', default: false, activeOnFalse: true,
    compute: options => !englishOnly(options) || options.uncommonAccents,
    if: options => englishOnly(options),
    wordFilter: w => !NON_ENGLISH_EXTENDED_REGEXP.test(w),
    info: 'When unchecked, filters out diacritics.',
  },
  
  {
    prop: 'preferInitialAccents', type: 'boolean', default: false,
    // if: options => options.collapseAccents,
    wordFilter: w => UNICODE_ACCENT_INITIAL_REGEXP.test(w),
  },

  {
    prop: 'preferAccents', type: 'boolean', default: true,
    wordFilter: w => UNICODE_ACCENT_REGEXP.test(w),
  },

  // (todo?) script might not be cased
  {
    prop: 'acronyms', type: 'boolean', default: false, activeOnFalse: true,
    wordFilter: w => !(w == w.toUpperCase())
  },

  {
    prop: "abbreviations", type: 'boolean', default: false, activeOnFalse: true,
    wordFilter: w => !/\.$/.test(w)
  },

  {
    prop: 'digits', type: 'boolean', default: false, activeOnFalse: true,
    letterFilter: ({ letter: l }) => !/\d/.test(l),
    wordFilter: w => !/\d/.test(w)
  },

  {
    prop: 'punctuation', type: 'boolean', default: false, activeOnFalse: true,
    letterFilter: ({ letter: l }) => (!PUNCTUATION_REGEXP.test(l)),
    wordFilter: w => !PUNCTUATION_REGEXP.test(w)
  },

  {
    prop: 'symbols', type: 'boolean', default: false, activeOnFalse: true,
    letterFilter: ({ letter: l }) => !(new XRegExp("[^\\pL]").test(l) || LETTER_SYMBOLS_REGEXP.test(l))
      || PUNCTUATION_REGEXP.test(l) || /\d/.test(l)
    // wordFilter: w => !(new XRegExp("[^\\pL]").test(w))
  },
];

function filterLanguages(suggestion, query, defaultFilter) {
  // fuzzy match but first letter exact match of any first letter in a word
  return defaultFilter(suggestion, query)
    && (!query.length || new RegExp("(^| )" + query[0], "i").test(suggestion));
}

function englishOnly(options) {
  const languages = computeLetteringOption('languages', options);
  return languages.length == 1 && languages[0] == 'English';
}

export const letteringOptionDefaults = objectFromArray(letteringOptions, 'prop', 'default');

export const letteringOptionTypes = objectFromArray(letteringOptions, 'prop', 'type');

export function getLetteringOption(prop) {
  return letteringOptions.find(o => o.prop == prop);
}

export function computeLetteringOption(prop, options) {
  let o = getLetteringOption(prop);
  return o.compute ? o.compute(options) : options[prop];
}

export function hasFilter(prop) {
  let opt = getLetteringOption(prop);
  return opt && (
    opt.letterFilter || opt.letterFilterFunc || opt.wordFilter || opt.wordFilterFunc);
}

export function getToggles(prop) {
  let o = getLetteringOption(prop);
  return o.labelToggles || o.labelToggle && [o.labelToggle] || [];
}
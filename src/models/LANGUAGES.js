import ISO6391 from "iso-639-1";

const replacements = {
  'Bosnian': [ 
    'Bosnian (Latin)',
    'Bosnian (Cyrillic)',
  ],
  'Serbian':[ 
    'Serbian (Latin)',
    'Serbian (Cyrillic)',
  ],
  'Inupiaq': [],
};

function getLanguages() {
  let languages = ISO6391.getAllNames().sort();
  Object.keys(replacements).forEach(key => {
    languages.splice(languages.indexOf(key), 1, ...replacements[key]);
  })
  return languages;
}

const LANGUAGES = getLanguages();
export { LANGUAGES };

/**
 * Maps a language name defined by ISO to the name of the data file with lemmas
 */
export function mapLanguage(language) {
  const map = {
    Croatian: 'Serbo-Croatian (Latin)',
    'Bosnian (Latin)':  'Serbo-Croatian (Latin)',
    'Bosnian (Cyrillic)': 'Serbo-Croatian (Cyrillic)',
    'Serbian (Latin)':  'Serbo-Croatian (Latin)',
    'Serbian (Cyrillic)': 'Serbo-Croatian (Cyrillic)',

    Avaric: 'Avar',
    Haitian: 'Haitian Creole',
    Inupiaq: null,
    Kalaallisut: 'Greenlandic',
    Kinyarwanda: 'Rwanda-Rundi',
    Kirundi: 'Rwanda-Rundi',
    Komi: 'Komi-Zyrian', //[ , 'Komi-Permyak' ],
    Māori: 'Maori',
    Nauru:  'Nauruan',
    Nuosu: 'Sichuan Yi',
    Pāli: 'Pali',
    Panjabi:  'Punjabi',
    Romansh: 'Romansch',
    Sinhala: 'Sinhalese',
    'Southern Sotho': 'Sotho',
    Swati: 'Swazi',
    'Tibetan Standard': 'Tibetan',
    Tonga:  'Tongan',
    Twi:  'Akan',
    'Western Frisian':  'West Frisian',
  };

  if (language in map)
    return map[language];
  else
    return language;
}

export function getLanguageCode(name) {
  let [language, script ] = name.split(/[()]/g);
  let suffix = '';
  switch (script) {
    case 'Latin':
      suffix = '-Latn';
      break;
    case 'Cyrillic':
      suffix = '-Cyrl'
      break;
  }
  return ISO6391.getCode(language.trim()) + suffix;
}

export function getLanguageName(langCode) {
  let [code, suffix] = langCode.split('-');
  let nameSuffix = '';
  switch (suffix) {
    case 'Latn':
      nameSuffix = ' (Latin)';
      break;
    case 'Cyrl':
      nameSuffix = ' (Cyrillic)';
      break;
  }
  return ISO6391.getName(code) + nameSuffix;
}

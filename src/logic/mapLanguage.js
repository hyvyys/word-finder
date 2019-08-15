/**
 * Returns Wiktionary's version of language name defined by ISO,
 * i.e., the name of the data file with lemmas
 */
export default function(language) {
  const map = {
    Avaric: 'Avar',
    Bosnian:  'Serbo-Croatian',
    Croatian: 'Serbo-Croatian',
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
    Serbian:  'Serbo-Croatian',
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
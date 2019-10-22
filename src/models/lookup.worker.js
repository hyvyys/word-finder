import FILTERS from "@/models/FILTERS";
import LENGTH_FILTER_MAX from "@/models/LENGTH_FILTER_MAX";
import { mapLanguage } from '@/models/LANGUAGES';
import { escapeRegExp, isRegExpValid } from '@/models/utils';

let languageWords = {};

function getLanguageWords(language) {
  return languageWords[mapLanguage(language)] || [];
}

function makeSearchRegex({ source, isRegex, isCaseSensitive }) {
  source = isRegex && isRegExpValid(source) ? source : escapeRegExp(source);
  return !source ? null : new RegExp(source, isCaseSensitive ? "" : "i");
}

self.onmessage = async function (e) {
  handleAction(e);
};

function handleAction(event) {
  let { action, ...payload } = event.data;
  switch (action) {
    case 'pushData': {
      const { language, data } = payload;
      languageWords[language] = data.split('\n');
      self.postMessage({ action: 'didPushData', language });
      break;
    }
    case 'setLanguages': {

      break;
    }    
    case 'query': {
      const { query } = payload;
      const { languages, lengthRange, searchPhrase, filterPhrase, isRegex, isCaseSensitive, filters } = query;
      const [ minLen, maxLen ] = lengthRange;
      let words = languages.flatMap(language => getLanguageWords(language));

      // console.time('filters')
      if (!words) return;

      const activeFilters = FILTERS.filter((f, i) => filters[i] == f.activeWhen);
      let negativeFilters = activeFilters.filter(f => f.disallowedSequence != null)
        .map(f => f.disallowedSequence);
    
      if (minLen > 1) {
        words = words.filter(w => w.length >= minLen);  
      }
      if (maxLen < LENGTH_FILTER_MAX) {
        words = words.filter(w => w.length <= maxLen);  
      }

      const searchRegex = makeSearchRegex({ source: searchPhrase, isRegex, isCaseSensitive });
      if (searchRegex) {
        words = words.filter(w => w.match(searchRegex));  
        // if search contains characters otherwise filtered out, disable those filters
        // e.g. search \. disables filter for \.
        negativeFilters = negativeFilters
          .filter(sequence => !searchRegex.test(sequence));
      }
      const filterRegex = makeSearchRegex({ source: filterPhrase, isRegex, isCaseSensitive });
      if (filterRegex) {
        words = words.filter(w => !w.match(filterRegex));  
      }

      if (negativeFilters.length) {
        const regex = new RegExp(negativeFilters.join('|'));
        words = words.filter(w => !regex.test(w));
      }
      
      const positiveFilters = activeFilters.filter(f => f.disallowedSequence == null);
      positiveFilters.forEach(f => {
        // console.time(f.label);
        words = words.filter(f.wordFilter);
        // console.timeEnd(f.label);
      })
      // console.timeEnd('filters')

      const resultCount = words.length;
      words = assortWords(words);

      if (languages.length > 1) {
        words = words.map(entry => {
          function unique(el, i, a) {
            return a.indexOf(el) === i;
          }
          entry.words = entry.words.length > 100 ? entry.words : entry.words.filter(unique);
          return entry;
        });
      }
      

      self.postMessage({ action: 'results', languages, words, resultCount });
      break;
    }
  }
}

function assortWords(words) {
  let letterWords = words
    .reduce((acc, curr) => {
      if (curr.length) {
        let letter = curr[0].toLowerCase();
        letter = letter.normalize('NFD')[0] // Normalization Form Canonical Decomposition
        const entry = acc.find(e => e.letter == letter);
        if (!entry) acc.push({ letter, words: [curr] });
        else entry.words.push(curr);
      }
      return acc;
    }, []);
  letterWords.sort((a, b) => a.letter.localeCompare(b.letter));
  // [ { letter: 'a', words: [ 'angle', 'app', ... ] }, ... ]
  return letterWords;
}


function mergeWords(languageWords) {
  const collapseAccents = true;
  let result = [];
  for (let language of Object.keys(languageWords)) {
    for (let entry of languageWords[language]) {
      let letter = entry.letter;
      if (collapseAccents) {
        letter = letter.normalize('NFD')[0] // Normalization Form Canonical Decomposition
      }
      const existingEntry = result.find(e => e.letter == letter);
      if (!existingEntry)
        result.push(entry);
      else
        existingEntry.words = [...existingEntry.words, ...entry.words];
    }
  }
  return result;
}
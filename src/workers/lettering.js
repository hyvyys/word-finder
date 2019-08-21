import { applyFilters } from "../logic/applyFilters";
import { parseData } from '../logic/parseData';

export default function(data) {
  let action = data.action;
  // console.log('worker: ' + action)
  switch (action) {
    case 'filter': {
      const result = applyFilters(data.words, data.options);
      return ({ action, result });
      break;
    }
    case 'merge': {
      let result = [];
      for (let language of data.words) {
        for (let entry of language) {
          let letter = entry.letter;
          if (data.collapseAccents) {
            letter = letter.normalize('NFD')[0] // Normalization Form Canonical Decomposition
          }
          const existingEntry = result.find(e => e.letter == letter);
          if (!existingEntry)
            result.push(entry);
          else
            existingEntry.words = existingEntry.words.concat(entry.words);
        }
      }
      return ({ action, result });
      break;
    }
    case 'parse': {
      const words = parseData(data.language, data.data);
      return ({ action, words });
      break;
    }
  }
}
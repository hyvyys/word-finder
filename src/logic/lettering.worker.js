import { applyFilters } from "./applyFilters";
import { parseData } from './parseData';

self.onmessage = async function (e) {
  let action = e.data.action;
  // console.log('worker: ' + action)
  switch (action) {
    case 'filter': {
      const result = applyFilters(e.data.words, e.data.options);
      self.postMessage({ action, result });
      break;
    }
    case 'merge': {
      let result = [];
      for (let language of e.data.words) {
        for (let entry of language) {
          let letter = entry.letter;
          if (e.data.collapseAccents) {
            letter = letter.normalize('NFD')[0] // Normalization Form Canonical Decomposition
          }
          const existingEntry = result.find(e => e.letter == letter);
          if (!existingEntry)
            result.push(entry);
          else
            existingEntry.words = existingEntry.words.concat(entry.words);
        }
      }
      self.postMessage({ action, result });
      break;
    }
    case 'parse': {
      const words = parseData(e.data.language, e.data.data);
      self.postMessage({ action, words });
      break;
    }
  }
};
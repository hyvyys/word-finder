import { letteringOptions } from "../logic/letteringOptions";

function tryFilter(data, filters) {
  let filterSatisfaction = {};
  for (let filter of filters) {
    filterSatisfaction[filter.prop] = true;

    const isDisabledToggle = filter.type == 'boolean'
      && (filter.activeOnFalse ? filter.value : !filter.value);

    if (!isDisabledToggle) {
      try {
        let maybeSubset = data.filter(filter.predicate);
        if (maybeSubset.length) {
          data = maybeSubset;
        }
        else {
          filterSatisfaction[filter.prop] = false;
        }
      }
      catch (error) {
        
      }
    }
  }

  return ({ data, filterSatisfaction });
}

export function applyFilters(data, optionValues) {
  let options = letteringOptions.slice();
  for (let key in optionValues) {
    options.find(o => o.prop == key).value = optionValues[key];
  }

  let letterFilters = options
    .filter(o => o.letterFilter || o.letterFilterFunc)
    .map(o => ({
      ...o,
      predicate:  o.letterFilterFunc ? o.letterFilterFunc(o.value) : o.letterFilter,
    }));

  let wordFilters = options
    .filter(o => o.wordFilter || o.wordFilterFunc)
    .map(o => ({
      ...o,
      predicate: o.wordFilterFunc ? o.wordFilterFunc(o.value) : o.wordFilter,
    }));


  let filterSatisfaction;
  ({ data, filterSatisfaction } = tryFilter(data, letterFilters));

  data = data.map(({ letter, words }) => {
    let filterSatisfaction;
    ({ data: words, filterSatisfaction } = tryFilter(words, wordFilters));
    return ({ letter, words, filterSatisfaction });
  });
  return ({ data, filterSatisfaction });
}
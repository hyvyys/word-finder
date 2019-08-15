import ISO6391 from 'iso-639-1';

export function parseData(language, text) {
  const languageCode = ISO6391.getCode(language);
  const words = text
  .split(/\n/)
  .reduce((acc, curr) => {
    if (curr.length) {
      let letter = curr[0].toLowerCase();
      const entry = acc.find(e => e.letter == letter);
        if (!entry) acc.push({ letter, words: [curr] });
        else entry.words.push(curr);
      }
      return acc;
    }, [])
    .sort((a, b) => a.letter.localeCompare(b.letter, languageCode))
    return words; // [ { letter: 'a', words: [ and, ally, apple... ] }, ... ] 
  }

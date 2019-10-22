export default function ({ search, languages } = {}) {
  const base = 'Word Finder'
  if (search)
    return `Find “${search}”  – ` + base;
  else if (languages && languages.length === 1)
    return `${languages}  – ` + base;
  else if (languages)
    return `${languages[0]} & ${languages.length - 1} more  – ` + base;
  return base; 
}
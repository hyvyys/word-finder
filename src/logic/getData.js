import mapLanguage from './mapLanguage';
import { parseData } from "./parseData";

export async function getData(language) {
  let mappedLanguage = mapLanguage(language);
  if (!mappedLanguage)
    return null;
  const url = './data/full/'
    + mappedLanguage + '.txt'
  const response = await fetch(url);
  const data = await response.text();
  return data;
}
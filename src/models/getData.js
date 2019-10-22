import { mapLanguage } from '@/models/LANGUAGES';

export default async function getData(language) {
  let mappedLanguage = mapLanguage(language);
  if (!mappedLanguage)
    return null;
  const url = './data/'
    + mappedLanguage + '.txt'
  const response = await fetch(url);
  const data = await response.text();
  if (data.indexOf('<!DOCTYPE html>') > -1) {
    console.error(`Request failed: ${language}`);
    return '';
  }
  return data;
}
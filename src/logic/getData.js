import mapLanguage from './mapLanguage';
import { parseData } from "./parseData";

export async function getData(language) {
  let mappedLanguage = mapLanguage(language);
  if (!mappedLanguage)
    return null;
  const url = './data/full/'
    + mappedLanguage + '.txt'
  const response = await fetch(url);
  return response;
}

async function readStream(language, response) {
  let data = [];
  var reader = response.body.getReader();
  var decoder = new TextDecoder();
  var partial = '';
  
  async function readChunk() {
    console.log('chunk')
    const result = await reader.read();
    let text = decoder.decode(result.value || new Uint8Array, {
      stream: !result.done
    });
    if (!result.done) {
      let last = text.lastIndexOf('\n');
      let chunk = partial + text.substring(0, last - 1);
      partial = text.substr(last + 1);
      data = data.concat(parseData(language, chunk));
      await readChunk();
    }
    else {
      let chunk = partial;
      data = data.concat(parseData(language, chunk));
    }
  }
  await readChunk();
  return data;
}
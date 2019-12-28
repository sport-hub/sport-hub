const { join, resolve } = require('path');
const { readdir, stat, readFile } = require('fs').promises;
const parser = require('fast-xml-parser');

const basePathCompetitions = join(__dirname, 'competitions');
const basePathTournaments = join(__dirname, 'tournaments');

async function* getFiles(rootPath) {
  const fileNames = await readdir(rootPath);
  for (const fileName of fileNames) { 
    const path = resolve(rootPath, fileName);
    if ((await stat(path)).isDirectory()) {
      yield* getFiles(path);
    } else {
      yield path;
    }
  }
}

async function reduce(asyncIter, f, init) {
  let res = init;
  for await (const x of asyncIter) {
    res = f(res, x);
  }
  return res;
}

const toArray = iter => reduce(iter, (a, x) => (a.push(x), a), []);

export async function GetValidXmlFiles() {
  return await toArray(getFiles(basePathCompetitions));
}

export async function GetValidJsonFiles() {
  return await toArray(getFiles(basePathTournaments));
}

export async function GetData(file) {
  console.debug('reading file', file);
  return await readFile(file, 'utf8');
}

export async function GetXmlData(file) {
  return parser.parse(await GetData(file));
}

export async function GetJsonData(file) {
  return JSON.parse(await GetData(file));
}

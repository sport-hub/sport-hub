const { readdir } = require("fs").promises;
const { join, resolve } = require("path");
const fs = require("fs");
const parser = require("fast-xml-parser");

const basePathCompetitions = join(__dirname, "competitions");
const basePathTournaments = join(__dirname, "tournaments");

export async function* getfiles(dir) {
  try {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* getfiles(res);
      } else {
        yield res;
      }
    }
  } catch (err) {
    return console.log("Unable to scan directory: " + err);
  }
}

export async function GetValidXmlFiles() {
  return getfiles(basePathCompetitions);
}

export async function GetValidJsonFiles() {
  return getfiles(basePathTournaments)
}

export function GetData(file) {
  console.debug("reading file", file);
  return fs.readFileSync(file, "utf8"); 
}

export function GetXmlData(file) {
  return parser.parse(GetData(file));
}

export function GetJsonData(file) {
  return JSON.parse(GetData(file));
}

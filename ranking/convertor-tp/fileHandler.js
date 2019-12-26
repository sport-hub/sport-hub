import { join } from 'path';
import { readdirSync } from 'fs';

export const basePathTp = join(__dirname, 'toernaments');

export function getTPfiles(directory) {
  try {
    return readdirSync(directory).filter(r => r.indexOf('.tp') >= 0);
  } catch (err) {
    return console.log('Unable to scan directory: ' + err);
  }
}

export function GetValidTpFiles() {
  return getTPfiles(basePathTp);
}

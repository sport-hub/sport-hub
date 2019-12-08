import { join } from 'path';
import { readdirSync } from 'fs';

export const basePathTp = join(__dirname, 'competitions');

export function getTPfiles(directory) {
  try {
    return readdirSync(directory).filter(r => r.toLowerCase().indexOf('.xml') >= 0);
  } catch (err) {
    return console.log('Unable to scan directory: ' + err);
  }
}
 
export function GetValidCpFiles() {
  return getTPfiles(basePathTp);
}

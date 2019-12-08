import { GetValidTpFiles } from './fileHandler';
import { ImportToernament } from './toernaments';

let files = GetValidTpFiles();
files.forEach(file => {
  ImportToernament(file);
});

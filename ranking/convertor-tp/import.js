import { GetValidTpFiles } from './fileHandler';
import { ImportToernament } from './toernaments';
import { config } from 'dotenv';
config();

let files = GetValidTpFiles();

files.forEach(file => {
  ImportToernament(file);
});

import { GetValidCpFiles } from './fileHandler';
import { ImportCompetition } from './competition';

let files = GetValidCpFiles();
if (files && files.length > 0) {
  files.forEach(file => {
    ImportCompetition(file);
  });
  console.info('Done converting')
} else {
  console.warn('No files found');
}

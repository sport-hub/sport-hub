import { GetValidXmlFiles, GetValidJsonFiles } from './fileHandler';
import { ImportCompetition } from './_competitions';
import { ImportToernament } from './_tournaments';
import PromisePool from '@supercharge/promise-pool';

export async function ImportAll() {
  // Competition is via tournament files
  // await importCompetitionFiles();
await importTournamentFiles();
  console.info('Imported all');
}

async function importCompetitionFiles() {
  let files = [...(await GetValidXmlFiles())];


  const { results, errors } = await PromisePool.for(files)
    .withConcurrency(3)
    .process(async file => {
      await ImportCompetition(file);
    });
  if (errors && errors.length > 0) {
    errors.forEach(error => {
      console.log(error);
    });
  }

  console.info('Imported competition');
}

async function importTournamentFiles() {
  let files = [...(await GetValidJsonFiles())];

  const { results, errors } = await PromisePool.for(files)
    .withConcurrency(3)
    .process(async file => {
      await ImportToernament(file);
    });
  if (errors && errors.length > 0) {
    errors.forEach(error => {
      console.log(error);
    });
  }

  console.info('Imported tournament');
}

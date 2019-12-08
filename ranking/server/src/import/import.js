import { GetValidXmlFiles, GetValidJsonFiles } from "./fileHandler";
import { ImportCompetition } from "./_competitions";
import { ImportToernament } from "./_tournaments";
export async function ImportAll() {
  await importCompetitionFiles();
  await importTournamentFiles();
  console.info("Imported all");
}

async function importCompetitionFiles() {
  let files = await GetValidXmlFiles();
  for await (const file of files) {
    await ImportCompetition(file);
  }
  console.debug("Imported competition");
}

async function importTournamentFiles() {
  let files = await GetValidJsonFiles();
  for await (const file of files) {
    await ImportToernament(file);
  }
  console.debug("Imported tournament");
}

import express from 'express';
import cors from 'cors';
import { Import, ImportAll } from './import/import';
import { CleanUp, Sync } from './database/databseHandler';
import { calculateRanking } from './ranking/calculate-ranking';

const app = express();

app.use(cors());

app.get('/import', async (req, res) => {
  try {
    let result;
    if (req.query.file) {
      result = Import(req.query.file);
    } else {
      result = ImportAll();
    }
    res.send('Processing started');
  } catch (error) {
    console.error(error);
    throw error;
  }
});
app.get('/cleanup', async (req, res) => {
  res.send(await CleanUp());
});

app.get('/sync', async (req, res) => {
  await Sync(req.query.force);
  res.send();
});

app.get('/calculate', async(req, res)=> {
   calculateRanking().then(result => res.json(result))
   res.send('Processing started');
  })

module.exports = app;

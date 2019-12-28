import { GetValidTpFiles } from './fileHandler';
import { ImportToernament } from './toernaments';
import { config } from 'dotenv';
import PromisePool from '@supercharge/promise-pool';

config();

(async () => {
  const performance = {
    now: function(start) {
      if (!start) return process.hrtime();
      var end = process.hrtime(start);
      return Math.round(end[0] * 1000 + end[1] / 1000000);
    }
  };

  let files = GetValidTpFiles();

  let times = [];
  var total0 = performance.now();

  const { results, errors } = await PromisePool.for(files)
    .withConcurrency(3)
    .process(async file => {
      var t0 = performance.now();
      await ImportToernament(file);
      var t1 = performance.now(t0);
      times.push(t1);
    });

  if (errors && errors.length > 0) {
    errors.forEach(error => {
      console.log(error);
    });
  }

  var total1 = performance.now(total0);
  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length || 0;

  console.log(`Import took ${total1} milliseconds.`);
  console.log(`Average was ${avg} milliseconds.`);
})();

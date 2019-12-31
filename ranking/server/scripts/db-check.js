const Sequelize = require('sequelize');
('use strict');

const timeoutPromise = time => {
  return new Promise((resolve, reject) => {
    console.log(
      'Creating sequelize with',
      process.env.MYSQL_DATABASE,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASSWORD,
      {
        host: process.env.SERVER_IP,
        dialect: 'mysql'
      }
    );

    let sequelize = new Sequelize(
      process.env.MYSQL_DATABASE,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASSWORD,
      {
        host: process.env.SERVER_IP,
        dialect: 'mysql'
      }
    );

    console.info('Creating db');
    sequelize
      .query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`)
      .then(data => {
        console.info('Database created if needed');
        resolve('Done');
      })
      .catch(err => {
        reject(err);
      });
  });
};

console.log('start');
return timeoutPromise(1000)
  .then(result => {
    console.log('end', result);
    process.exit(0); // usually 0 for 'ok', just demo!
  })
  .catch(err => {
    console.error('Error', err);
    process.exit(1); // usually 0 for 'ok', just demo!
  });

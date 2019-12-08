'use strict';

import { Sequelize } from 'sequelize';
import { Player } from './player';
import { SubEvent } from './subEvent';
import { Game } from './game';
import { Team } from './team';
import { Event } from './event';
import { Ranking } from './ranking';

let sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    dialect: 'mysql',
    logging: false
  }
);

const models = {
  Player: Player.init(sequelize, Sequelize),
  Event: Event.init(sequelize, Sequelize),
  SubEvent: SubEvent.init(sequelize, Sequelize),
  Game: Game.init(sequelize, Sequelize),
  Team: Team.init(sequelize, Sequelize),
  Ranking: Ranking.init(sequelize, Sequelize)
};

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate());

const db = {
  ...models,
  sequelize,
  Sequelize
};

module.exports = db;

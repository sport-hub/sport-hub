import { Model } from 'sequelize';
import { Game } from './game';
import { Event } from './event';
import { Team } from './team';

export class SubEvent extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        poule: DataTypes.STRING,
        size: DataTypes.INTEGER,
        type: DataTypes.ENUM({
          values: ['G', 'H', 'D']
        })
      },
      {
        sequelize
      }
    );
  }

  static associate() {
    this.games = this.hasMany(Game);
    this.teams = this.hasMany(Team);
    this.events = this.belongsTo(Event);
  }
}

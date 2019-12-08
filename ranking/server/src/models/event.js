import { Model } from 'sequelize';
import { Game } from './game';
import { SubEvent } from './subEvent';

export class Event extends Model {
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
        division: DataTypes.STRING,
        league: DataTypes.ENUM({
          values: ['PROV', 'LIGA', 'NATIONAAL', 'BASIC']
        }),
        type: DataTypes.ENUM({
          values: ['COMPETITION', 'TOERNAMENT']
        }),
        name: DataTypes.STRING
      },
      {
        sequelize
      }
    );
  }

  static associate() {
    this.subEvents = this.hasMany(SubEvent);
  }
}

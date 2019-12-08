import { Model } from 'sequelize';
import { Game } from './game';
import { Player } from './player';
import { SubEvent } from './subEvent';

export class Team extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
      },
      {
        sequelize
      }
    );
  }

  static associate() {
    this.subEvent = this.belongsTo(SubEvent);
    this.players = this.belongsToMany(Player, {
      through: 'PlayerTeams'
    });
  }
}

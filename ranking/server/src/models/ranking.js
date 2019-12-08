import { Model } from 'sequelize';
import { Player } from './player';
import { Game } from './game';

export class Ranking extends Model {
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
        playedAt: DataTypes.DATE,
        points: DataTypes.INTEGER,
        type: DataTypes.ENUM({
          values: ['CURRENT', 'LFBB']
        })
      },
      {
        sequelize
      }
    );
  }

  static associate() {
    this.player = this.belongsTo(Player);
    this.game = this.belongsTo(Game);
  }
}

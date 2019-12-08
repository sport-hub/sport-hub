import { Model } from 'sequelize';
import { Player } from './player';
import { SubEvent } from './subEvent';
import { Ranking } from './ranking';

export class Game extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: DataTypes.ENUM({
          values: ['S', 'D', 'MX']
        }),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,

        playedAt: DataTypes.DATE,

        set1_team1: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        set1_team2: {
          type: DataTypes.INTEGER,
          allowNull: true
        },

        set2_team1: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        set2_team2: {
          type: DataTypes.INTEGER,
          allowNull: true
        },

        set3_team1: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        set3_team2: {
          type: DataTypes.INTEGER,
          allowNull: true 
        }
      },
      {
        sequelize
      }
    );
  } 

  // Associations
  static associate() {
    this.subEvent = this.belongsTo(SubEvent);

    this.player1_team1 = this.belongsTo(Player, {
      as: 'player1_team1',
      foreignKey: 'player1Team1Id'
    });
    this.player1_team2 = this.belongsTo(Player, {
      as: 'player1_team2',
      foreignKey: 'player1Team2Id'
    });
    this.player2_team1 = this.belongsTo(Player, {
      as: 'player2_team1',
      foreignKey: 'player2Team1Id'
    });
    this.player2_team2 = this.belongsTo(Player, {
      as: 'player2_team2',
      foreignKey: 'player2Team2Id'
    });

    this.rankings = this.hasMany(Ranking);
  }
}

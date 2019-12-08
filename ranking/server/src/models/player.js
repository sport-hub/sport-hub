import { Model } from 'sequelize';
import { Game } from './game';
import { Team } from './team';
import { Ranking } from './ranking';

export class Player extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        email: DataTypes.STRING,
        gender: DataTypes.STRING,
        token: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING
      },
      {
        sequelize
      }
    );
  }

  // Assicioations
  static associate() {
    this.games1 = this.hasMany(Game, { as: 'player1_team1', foreignKey: 'player1Team1Id' });
    this.games2 = this.hasMany(Game, { as: 'player1_team2', foreignKey: 'player1Team2Id' });
    this.games3 = this.hasMany(Game, { as: 'player2_team1', foreignKey: 'player2Team1Id' });
    this.games4 = this.hasMany(Game, { as: 'player2_team2', foreignKey: 'player2Team2Id' });
    
    this.ranking = this.hasMany(Ranking);


    this.teams = this.belongsToMany(Team, {
      through: 'PlayerTeams'
    });
  }

  // Mutations
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // Queries
  async getId(where) {
    const users = await this.findOrCreate({
      where,
      attributes: ['id'],
      order: [['createdAt', 'DESC']]
    });

    return users && users[0] ? users[0] : null;
  }
}

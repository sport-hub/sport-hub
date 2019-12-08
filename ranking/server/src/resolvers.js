import moment from 'moment';

module.exports = {
  Query: {
    players: async (_, { limit = 20, skip = 0, search }, { models }, info) => {
      let options = { limit, skip };
      if (search) {
        var parts = search.split(' ');
        var queries = [];
        for (let part of parts) {
          queries.push({
            [models.Sequelize.Op.or]: [
              { firstName: { [models.Sequelize.Op.like]: `%${part}%` } },
              { lastName: { [models.Sequelize.Op.like]: `%${part}%` } }
            ]
          });
        }

        options.where = {
          [models.Sequelize.Op.and]: queries
        };
      }
      let result = await models.Player.findAndCountAll(options);
      return { count: result.count, result: result.rows };
    },
    player: async (parent, { id }, { models }, info) => {
      return await models.Player.findByPk(id);
    },
    games: async (_, { limit = 20, skip = 0 }, { models }, info) => {
      let result = await models.Game.findAndCountAll({ limit, skip });
      return { count: result.count, result: result.rows };
    },
    game: (parent, { id }, { models }, info) => models.Game.findByPk(id),
    events: (parent, args, { models }, info) => models.Event.findAll(),
    event: (parent, { id }, { models }, info) => models.Event.findByPk(id)
  },

  PlayerListPlayer: {
    fullName(parent, args, { models }, info) {
      return parent.getFullName();
    }
  },

  Player: {
    fullName(parent, args, { models }, info) {
      return parent.getFullName();
    },
    async games(parent, args, { models }, info) {
      let result = await models.Game.findAndCountAll({
        where: {
          [models.Sequelize.Op.or]: {
            player1Team1Id: parent.id,
            player1Team2Id: parent.id,
            player2Team1Id: parent.id,
            player2Team2Id: parent.id
          }
        }
      });
      return {
        count: result.count,
        result: result.rows
          .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
          .map(game => setGameWon(game, parent.id))
          .map(game => setpartner(game, parent.id))
      };
    },
    async ranking(parent, args, { models }, info) {
      const before = moment()
        .subtract(53, 'year')
        .toDate();

      var ranking = await Promise.all([
        models.Ranking.findAll({
          where: {
            PlayerId: parent.id
          },
          include: [
            {
              model: models.Game,
              where: {
                [models.Sequelize.Op.and]: {
                  type: 'S',
                  playedAt: {
                    [models.Sequelize.Op.gte]: before
                  }
                }
              }
            }
          ]
        }),
        models.Ranking.findAll({
          where: {
            PlayerId: parent.id
          },
          order: [],
          include: [
            {
              model: models.Game,
              where: {
                [models.Sequelize.Op.and]: {
                  type: 'D',
                  playedAt: {
                    [models.Sequelize.Op.gte]: before
                  }
                }
              }
            }
          ]
        }),
        models.Ranking.findAll({
          where: {
            PlayerId: parent.id
          },
          order: ['points'],
          include: [
            {
              model: models.Game,
              where: {
                [models.Sequelize.Op.and]: {
                  type: 'MX',
                  playedAt: {
                    [models.Sequelize.Op.gte]: before
                  }
                }
              }
            }
          ]
        })
      ]);

      let singlePoints = ranking[0].reduce((a, b) => a + b.points, 0);
      let doublePoints = ranking[1].reduce((a, b) => a + b.points, 0);
      let mixPoints = ranking[2].reduce((a, b) => a + b.points, 0);

      return {
        single: getRanking(singlePoints),
        singlePoints,
        double: getRanking(doublePoints),
        doublePoints,
        mix: getRanking(mixPoints),
        mixPoints
      };
    },
    rankings(parent, args, { models }, info) {
      return models.Ranking.findAll({
        where: {
          PlayerId: parent.id
        },
        include: [{ model: models.Game }]
      });
    }
  },

  Game: {
    player1_team1(parent, args, { models }, info) {
      return models.Player.findByPk(parent.player1Team1Id);
    },
    player1_team2(parent, args, { models }, info) {
      return models.Player.findByPk(parent.player1Team2Id);
    },
    player2_team1(parent, args, { models }, info) {
      return models.Player.findByPk(parent.player2Team1Id);
    },
    player2_team2(parent, args, { models }, info) {
      return models.Player.findByPk(parent.player2Team2Id);
    }
  },

  SubEvent: {
    draw(parent, args, { models }, info) {
      switch (parent.Event.league) {
        // Toernaments
        case 'BASIC':
        case 'TOP':
          return `${parent.poule}`;
        // Competition
        case 'PROV':
          return `${parent.Event.division}e ${
            parent.Event.league
          } ${readableType(parent.type)} - ${parent.poule}`;
        default:
          return 'Woops';
      }
    }
  },
  PlayerGame: {
    async partner(parent, args, { models }, info) {
      if (!parent.opponentPartner) return null;
      return await models.Player.findByPk(parent.partner);
    },
    async opponent(parent, args, { models }, info) {
      return await models.Player.findByPk(parent.opponent);
    },
    async opponentPartner(parent, args, { models }, info) {
      if (!parent.opponentPartner) return null;
      return await models.Player.findByPk(parent.opponentPartner);
    },
    async SubEvent(parent, args, { models }, info) {
      return await models.SubEvent.findOne({
        where: {
          id: parent.SubEventId
        },
        // We know that when you request an SubEvent, you will want to know the Event aswell
        include: [{ model: models.Event }]
      });
    }
  }
};

export function setGameWon(game, playerId) {
  let sets = 0;
  if (game.player1Team1Id == playerId || game.player2Team1Id == playerId) {
    // Player is in team 1
    game.team1 = true;
    sets += game.set1_team1 > game.set1_team2 ? 1 : 0;
    sets += game.set2_team1 > game.set2_team2 ? 1 : 0;

    if (game.set3_team1) {
      sets += game.set3_team1 > game.set3_team2 ? 1 : 0;
    }
  } else {
    game.team1 = false;
    sets += game.set1_team2 > game.set1_team1 ? 1 : 0;
    sets += game.set2_team2 > game.set2_team1 ? 1 : 0;

    if (game.set3_team1) {
      sets += game.set3_team2 > game.set3_team1 ? 1 : 0;
    }
  }
  game.won = sets >= 2;
  return game;
}

export function setpartner(game, playerId) {
  if (game.player1Team1Id == playerId) {
    game.partner = game.player2Team1Id;

    game.opponent = game.player1Team2Id;
    game.opponentPartner = game.player2Team2Id;
  } else if (game.player2Team1Id == playerId) {
    game.partner = game.player1Team1Id;

    game.opponent = game.player1Team2Id;
    game.opponentPartner = game.player2Team2Id;
  } else if (game.player1Team2Id == playerId) {
    game.partner = game.player2Team2Id;

    game.opponent = game.player1Team1Id;
    game.opponentPartner = game.player2Team1Id;
  } else {
    game.partner = game.player1Team2Id;

    game.opponent = game.player1Team1Id;
    game.opponentPartner = game.player2Team1Id;
  }

  return game;
}

function getRanking(points) {
  if (points > 120) {
    return 'C2';
  }

  if (points > 350) {
    return 'C1';
  }
  if (points > 600) {
    return 'B2';
  }

  if (points > 1050) {
    return 'B1';
  }
  if (points > 1500) {
    return 'A';
  }
  return 'D';
}

function readableType(type) {
  switch (type) {
    case 'G':
      return 'Gemengd';
    case 'H':
      return 'Heren';
    case 'D':
      return 'Dames';
  }
}

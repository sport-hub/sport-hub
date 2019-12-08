import models from '../models';
import moment from 'moment';

export async function calculateRanking() {
  let players = await models.Player.findAll();

  const promises = players.map(processPlayer);
  await Promise.all(promises);

  return 'Done';
}

async function processPlayer(player) {
  const games = await findGames(player);
  const rankings = await calculateRankings(games, player.id);
  await models.Ranking.bulkCreate(rankings);
}

async function findGames(player) {
  return await models.Game.findAll({
    where: {
      [models.Sequelize.Op.and]: {
        [models.Sequelize.Op.or]: {
          player1Team1Id: player.id,
          player1Team2Id: player.id,
          player2Team1Id: player.id,
          player2Team2Id: player.id
        }
      }
    },
    include: [{ model: models.SubEvent, include: [{ model: models.Event }] }]
  });
}
async function calculateRankings(games, PlayerId) {
  const rankings = [];
  games.forEach(game => {
    if (game.SubEvent.Event.league == 'PROV') {
      let section =
        points[game.SubEvent.type][game.SubEvent.Event.league][
          game.SubEvent.Event.division
        ];
      setGameWon(game, PlayerId);

      try {
        rankings.push({
          type: 'CURRENT',
          PlayerId,
          points: game.won ? section.win : section.lose,
          GameId: game.id
        });
      } catch (err) {
        console.debug(
          game.SubEvent.type,
          game.SubEvent.Event.league,
          game.SubEvent.Event.division
        );
        console.debug('game.SubEvent.id', game.SubEvent.id);
        console.debug('game.SubEvent.Event.id', game.SubEvent.Event.id);
        console.debug('PlayerId', PlayerId);
        console.error('Something went wrong', err);
      }
    }
  });
  return rankings;
}

const points = {
  G: {
    LIGA: {
      1: {
        win: 141,
        lose: 28
      },
      2: {
        win: 123,
        lose: 25
      },
      3: {
        win: 105,
        lose: 21
      }
    },
    PROV: {
      1: {
        win: 70,
        lose: 14
      },
      2: {
        win: 53,
        lose: 11
      },
      3: {
        win: 40,
        lose: 8
      },
      4: {
        win: 26,
        lose: 5
      },
      5: {
        win: 16,
        lose: 3
      },
      6: {
        win: 16,
        lose: 3
      }
    }
  },
  H: {
    LIGA: {
      1: {
        win: 141,
        lose: 28
      },
      2: {
        win: 123,
        lose: 25
      },
      3: {
        win: 105,
        lose: 21
      }
    },
    PROV: {
      1: {
        win: 70,
        lose: 14
      },
      2: {
        win: 53,
        lose: 11
      },
      3: {
        win: 40,
        lose: 8
      },
      4: {
        win: 26,
        lose: 5
      },
      5: {
        win: 16,
        lose: 3
      },
      6: {
        win: 16,
        lose: 3
      }
    }
  },
  D: {
    LIGA: {
      1: {
        win: 141,
        lose: 28
      },
      2: {
        win: 105,
        lose: 21
      },
      3: {
        win: 40,
        lose: 8
      }
    },
    PROV: {
      1: {
        win: 40,
        lose: 8
      },
      2: {
        win: 26,
        lose: 5
      },
      3: {
        win: 16,
        lose: 3
      },
      4: {
        win: 16,
        lose: 3
      }
    }
  }
};

function setGameWon(game, playerId) {
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
  }
  game.won = sets >= 2;
  return game;
}

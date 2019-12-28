import { GetJsonData } from './fileHandler';
import {
  AddUsers,
  AddEvent,
  AddSubEvent,
  AddGames
} from '../database/databseHandler';

export async function ImportToernament(file) {
  console.log('Started import toernament', file);
  var data = await GetJsonData(file);

  try {
    const players = data.players.map(member => {
      return {
        id: member.memberid,
        firstName: member.firstname,
        lastName: member.name,
        gender: member.gender == 1 ? 'M' : 'F'
      };
    });

    await AddUsers(players);

    for await (const event of data.events) {
      var dbEvent = await AddEvent({
        name: event.name,
        league: event.league,
        division: event.division,
        type: event.type
      });

      for await (const subEvent of event.subEvents) {
        let dbSubEvent = await AddSubEvent({
          EventId: dbEvent.id,
          poule: subEvent.poule,
          type: eventType[subEvent.gender]
        });
        let matches = subEvent.matches.map(match => {
          return {
            playedAt: new Date(match.playedAt),
            type: gameType[match.gender],
            SubEventId: dbSubEvent.id,
            player1Team1Id: match.team1_player1,
            player2Team1Id: match.team1_player2,
            player1Team2Id: match.team2_player1,
            player2Team2Id: match.team2_player2,
            set1_team1: match.set1_team1,
            set1_team2: match.set1_team2,
            set2_team1: match.set2_team1,
            set2_team2: match.set2_team2,
            set3_team1: match.set3_team1,
            set3_team2: match.set3_team2
          };
        });
        await AddGames(matches);
      }
    }

    console.log('Finished import');

    return 'All good';
  } catch (e) {
    console.error('something went bad', e);

    throw e;
  }
}

const gameType = ['S', 'D', 'MX'];
const eventType = ['H', 'D', 'G'];

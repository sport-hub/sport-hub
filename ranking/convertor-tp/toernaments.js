import ADODB from 'node-adodb';
import { basename, join } from 'path';
import { basePathTp } from './fileHandler';
ADODB.debug = true;

// import {writeFile, exists, mkdir} from 'fs';
const { promises: fs, existsSync } = require('fs');
export async function ImportToernament(file) {
  const connectionString = `Provider=Microsoft.Jet.OLEDB.4.0;Data Source='${join(
    basePathTp,
    file
  )}';Jet OLEDB:Database Password=${process.env.ACCESS_DB};`;

  var connection = ADODB.open(connectionString);

  try {
    var dBTournament = await connection.query(
      `select name, value from Settings where name='Tournament' or name='TournamentNr'`
    );
    var dBTournamentday = await connection.query(
      `select tournamentday from TournamentDay`
    );
  } catch (e) {
    throw new Error(
      'Something went wrong getting tournament info from the db',
      e
    );
  }

  var tournamentName = dBTournament.find(x => x.name == 'Tournament').value;
  var tournamentDay = new Date(dBTournamentday[0].tournamentday);
  var tournamentNumber = parseInt(
    dBTournament.find(x => x.name == 'TournamentNr').value
  );

  if (isNaN(tournamentNumber)) {
    // console.debug(`${tournamentName} is not a valid tournament`);
    return;
  }

  try {
    var players = await getPlayers();
  } catch (e) {
    throw new Error('Something went wrong getting players', e);
  }

  try {
    var db = {
      events: await getEvents(tournamentName, players),
      players
    };
  } catch (e) {
    throw new Error('Something went wrong getting events', e);
  }

  const dir = join(
    __dirname,
    `../server/src/import/tournaments/${tournamentDay.getFullYear()}/`
  );

  try {
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }
  } catch (e) {
    throw new Error('Something went wrong making the dir', e);
  }

  const fileLocation = join(
    dir,
    `${tournamentDay.getFullYear()} - ${tournamentNumber}.json`
  );

  await fs.writeFile(fileLocation, JSON.stringify(db, null, 2));

  async function getPlayers() {
    return await connection.query(
      `select id, memberid, firstname, name, gender from Player`
    );
  }

  async function getEvents(name, players) {
    // var SubEventTypes = ['H', 'D', 'G'];
    var events = [];

    try {
      var dbEvents = await connection.query(
        `select id, name, gender, eventtype from Event`
      );

      var dbDraws = await connection.query(
        `select id, name, event, drawsize, drawtype from Draw`
      );

      var dbPlayerMatches = await connection.query(
        `select id, event, draw, planning, plandate, entry, wn, van1, van2, team1set1, team2set1, team1set2, team2set2, team1set3, team2set3, winner from PlayerMatch`
      );

      var dbEntries = await connection.query(
        `select id, player1, player2 from Entry`
      );
    } catch (e) {
      throw new Error(
        'Something went wrong getting events from from the db',
        e
      );
    }

    try {
      dbEvents.forEach(dbEvent => {
        var division = dbEvent.name.slice(2);
        var league = 'BASIC'; // type toernament

        events.push({
          type: 'TOERNAMENT',
          name,
          division,
          league,
          subEvents: []
        });
      });
    } catch (error) {
      console.error('Something went wrong processings events', error);
      throw new Error('Something went wrong processings events', error);
    }

    try {
      dbDraws.forEach(dbDraw => {
        // Find from original
        var dbEvent = dbEvents.find(e => e.id == dbDraw.event);
        // find in new set
        var name = dbEvent.name.slice(2);
        var event = events.find(e => e.division == name);

        event.subEvents.push({
          poule: dbDraw.name,
          gender: dbEvent.gender - 1, // Toernooi.nl works with 1 based instead of 0 based array
          event_type: dbEvent.eventtype,
          draw_type: dbDraw.drawtype,
          size: dbDraw.drawsize,
          matches: []
        });
      });
    } catch (error) {
      console.error('Something went wrong processings draws', error);
      throw new Error('Something went wrong processings draws', error);
    }

    try {
      // Build KO's
      dbPlayerMatches
        .map(x => {
          return {
            ...x,
            van1: x.van1 == 0 ? null : x.van1,
            van2: x.van2 == 0 ? null : x.van2
          };
        })
        .filter(x => x.van1 !== null && x.van2 !== null)
        .forEach(dbPlayerMatch => {
          var playerMatch1 = dbPlayerMatches.find(
            x =>
              x.planning == dbPlayerMatch.van1 &&
              x.event == dbPlayerMatch.event &&
              x.draw == dbPlayerMatch.draw
          );
          var playerMatch2 = dbPlayerMatches.find(
            x =>
              x.planning == dbPlayerMatch.van2 &&
              x.event == dbPlayerMatch.event &&
              x.draw == dbPlayerMatch.draw
          );
          var dbEvent = dbEvents.find(e => e.id == dbPlayerMatch.event);
          var dbDraw = dbDraws.find(e => e.id == dbPlayerMatch.draw);
          var name = dbEvent.name.slice(2);
          var event = events.find(event => event.division == name);

          var subEvent = event.subEvents.find(
            subEvent =>
              subEvent.poule == dbDraw.name &&
              subEvent.gender == dbEvent.gender - 1 // Toernooi.nl works 1 based instead of 0 based!
          );
          if (!playerMatch1) {
            console.warn('No player1 in a match?')
            // console.log(
            //   event.division,
            //   subEvent.poule,
            //   dbPlayerMatch,
            //   playerMatch1
            // );
            return;
          }

          var dbEntry1 = dbEntries.find(e => e.id == playerMatch1.entry);
          if (playerMatch2) {
            var dbEntry2 = dbEntries.find(e => e.id == playerMatch2.entry);
          }

          if (dbDraw.drawtype == DrawType.KO) {
            // TODO: Check if ever have more then 9
            var final = parseInt(
              dbPlayerMatch.planning.toString().substring(0, 1)
            );
            // final = `Place 1/${Math.pow(2, final - 1)}`;
          } else {
            var final = undefined;
          }
          addMatch(dbEntry1, dbEntry2, dbPlayerMatch, final, subEvent);
        });
    } catch (error) {
      console.error('Something went wrong processings player matches', error);
      throw new Error(
        'Something went wrong processings  player matches',
        error
      );
    }

    return events;

    function addMatch(dbEntry, dbOponentEntry, match, final, subEvent) {
      try {
        subEvent.matches.push({
          final,
          playedAt: match.plandate,
          team1_player1: getMemberId(dbEntry ? dbEntry.player1 : null),
          team1_player2: getMemberId(dbEntry ? dbEntry.player2 : null),
          team2_player1: getMemberId(
            dbOponentEntry ? dbOponentEntry.player1 : null
          ),
          team2_player2: getMemberId(
            dbOponentEntry ? dbOponentEntry.player2 : null
          ),
          set1_team1: match.team1set1 == 0 ? null : match.team1set1,
          set1_team2: match.team2set1 == 0 ? null : match.team2set1,
          set2_team1: match.team1set2 == 0 ? null : match.team1set2,
          set2_team2: match.team2set2 == 0 ? null : match.team2set2,
          set3_team1: match.team1set3 == 0 ? null : match.team1set3,
          set3_team2: match.team2set3 == 0 ? null : match.team2set3,
          winner: match.winner
        });
      } catch (e) {
        console.error('Something went wrong adding match', e);
        throw new Error('Something went wrong adding match', e);
      }

      function getMemberId(number) {
        try {
          if (!number || number == 0) return null;
          var player = players.find(player => player.id == number);
          if (!player) {
            console.warn('Not null number found no player??', number);
            return null;
          }
          return player.memberid;
        } catch (e) {
          console.error('Something went wrong getting memberId', e);
          throw new Error('Something went wrong getting memberId', e);
        }
      }
    }
  }
}

var DrawType = Object.freeze({
  KO: 1,
  POULE: 2
});

var SubEventTypes = Object.freeze({
  H: 1,
  D: 2,
  G: 3
});

var EventTypes = Object.freeze({
  S: 1,
  D: 2
});

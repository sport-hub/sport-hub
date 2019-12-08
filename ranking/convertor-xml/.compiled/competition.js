import { join, parse as pathParser } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { parse as xmlParser } from 'fast-xml-parser';
import { parse as csvParser } from 'papaparse';
import { create } from 'xmlbuilder';
const basePathFiles = join(__dirname, 'competitions');
export async function ImportCompetition(file) {
  console.log('Importing', file);
  var xmlData = GetXmlData(join(basePathFiles, file));
  var fixtures = GetCsvData(join(basePathFiles, `${pathParser(file).name} fixtures.csv`));
  var matches = GetCsvData(join(basePathFiles, `${pathParser(file).name} matches.csv`));
  xmlData.League.Event.forEach(event => {
    var divisions = Array.isArray(event.Division) ? [...event.Division] : [event.Division];
    divisions.forEach(division => {
      var foundFixtures = fixtures.filter(x => x.drawid == division.DivisionLPId);
      division.Fixture = [...foundFixtures.map(fixture => {
        var foundMatches = matches.filter(x => x.teammatchid == fixture.matchid);
        var dateParts = `${fixture.plannedtime}`.replace(new RegExp('-', 'g'), ' ').replace(new RegExp(':', 'g'), ' ').split(' ');
        var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4], dateParts[5]);
        fixture.Match = [...foundMatches.map(match => {
          return {
            MatchLPId: match.matchid,
            MatchNum: match.matchorder,
            MatchType: match.matchtypeid,
            MatchTypeNo: match.matchtypeno,
            MatchWinner: match.winner,
            MatchPlayer1: 'NA',
            MatchPlayer2: 'NA',
            MatchWinnerName: 'NA',
            MatchWinnerLTANo: match.winner == 1 ? match.team1player1memberid : match.team2player1memberid,
            MatchWinnerPartner: 'NA',
            MatchWinnerPartnerLTANo: match.winner == 1 ? match.team1player2memberid : match.team2player2memberid,
            MatchLoserName: 'NA',
            MatchLoserLTANo: match.winner == 2 ? match.team2player1memberid : match.team1player1memberid,
            MatchLoserPartner: 'NA',
            MatchLoserPartnerLTANo: match.winner == 2 ? match.team2player2memberid : match.team1player2memberid,
            MatchScore: 'NA',
            MatchScoreCode: 'NA',
            MatchDay: date.getDay(),
            MatchMonth: date.getMonth(),
            MatchYear: date.getFullYear(),
            MatchStartTime: `${date.getHours()}:${date.getMinutes()}`,
            MatchEndTime: 'NA',
            MatchTeam1Set1: match.set1team1,
            MatchTeam1Set2: match.set1team2,
            MatchTiebreak1: 'NA',
            MatchTeam2Set1: match.set2team1,
            MatchTeam2Set2: match.set2team2,
            MatchTiebreak2: 'NA',
            MatchTeam3Set1: match.set3team1,
            MatchTeam3Set2: match.set3team2,
            MatchTiebreak3: 'NA',
            MatchDeleteFlag: 'N'
          };
        })];
        var team1Games = fixture.Match.filter(x => x.MatchWinner == 1).length;
        var team2Games = fixture.Match.filter(x => x.MatchWinner == 2).length;
        var team1 = xmlData.League.Team.find(x => x.TeamName.replace('&amp;', '&').indexOf(fixture.team1name) >= 0);
        var team2 = xmlData.League.Team.find(x => x.TeamName.replace('&amp;', '&').indexOf(fixture.team2name) >= 0);
        var winner = fixture.winner == 1 ? {
          name: team1 ? team1.TeamName : null,
          id: team1 ? team1.TeamLPId : null
        } : fixture.winner == 2 ? {
          name: team2 ? team2.TeamName : null,
          id: team2 ? team2.TeamLPId : null
        } : {
          name: '',
          id: ''
        };
        var loser = fixture.winner == 2 ? {
          name: team2 ? team2.TeamName : null,
          id: team2 ? team2.TeamLPId : null
        } : fixture.winner == 1 ? {
          name: team1 ? team1.TeamName : null,
          id: team1 ? team1.TeamLPId : null
        } : {
          name: '',
          id: ''
        };
        return {
          FixtureLPId: fixture.matchid,
          FixtureNum: 'NA',
          FixtureRound: 'NA',
          FixtureTeam1: team1 ? team1.TeamName : null,
          FixtureTeam2: team2 ? team2.TeamName : null,
          FixtureTeam1Id: team1 ? team1.TeamLPId : null,
          FixtureTeam2Id: team2 ? team2.TeamLPId : null,
          FixtureWinner: fixture.winner,
          FixtureWinnerTeamId: winner.id,
          FixtureWinnerName: winner.name,
          FixtureLoserTeamId: loser.id,
          FixtureLoserName: loser.name,
          FixtureScore: `${team1Games}-${team2Games}`,
          FixtureScoreCode: 'NA',
          FixtureDay: date.getDay(),
          FixtureMonth: date.getMonth(),
          FixtureYear: date.getFullYear(),
          FixtureStartTime: `${date.getHours()}:${date.getMinutes()}`,
          FixtureEndTime: 'NA',
          FixturePlanningId: 'NA',
          FixtureFromMatchPlanningId1: 'NA',
          FixtureFromMatchPlanningId2: 'NA',
          FixtureWinnerPlanningId: 'NA',
          FixtureLoserPlanningId: 'NA',
          FixtureTeam1Points: fixture.team1points,
          FixtureTeam2Points: fixture.team2points,
          FixtureTeam1Sets: fixture.team1sets,
          FixtureTeam2Sets: fixture.team2sets,
          FixtureTeam1Games: team1Games,
          FixtureTeam2Games: team2Games,
          FixtureTeam1RRPos: '',
          FixtureTeam2RRPos: '',
          FixtureDeleteFlag: 'N',
          Match: fixture.Match
        };
      })];
    });
  });
  var diretory = join(__dirname, '../../server/src/import/competitions');
  var year = file.substr(file.lastIndexOf(' ') + 1, 9);
  writeFileSync(join(diretory, year, file), create(xmlData, {
    encoding: 'utf-8'
  }).end({
    pretty: true,
    indent: '    '
  }));
}
export function GetData(file) {
  console.debug('reading file', file);
  return readFileSync(file, 'utf8');
}
export function GetXmlData(file) {
  return xmlParser(GetData(file));
}
export function GetCsvData(file) {
  var test = csvParser(GetData(file), {
    header: true,
    dynamicTyping: true
  });
  return test.data;
}
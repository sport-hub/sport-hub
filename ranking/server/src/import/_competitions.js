import { GetXmlData } from "./fileHandler";
import {
  AddUsers,
  AddGames,
  AddSubEvent,
  AddEvent
} from "../database/databseHandler";

export async function ImportCompetition(file) {
  console.info("Started import", file);
  var data = GetXmlData(file);

  try {
    for await (const xmlTeam of data.League.Team) {
      if (!xmlTeam.Member) {
        console.info(`No members found for ${xmlTeam.TeamName}`);
        return;
      }
      await AddUsers(
        xmlTeam.Member.map(member => {
          return {
            id: member.MemberLTANo,
            firstName: member.MemberFirstName,
            lastName: member.MemberLastName,
            gender: member.MemberGender
          };
        })
      );
    }
    console.debug("Added users");

    for await (const xmlEvent of data.League.Event) {
      xmlEvent.EventName = xmlEvent.EventName.replace("°", "e");

      let event = await AddEvent({
        league:
          xmlEvent.EventName.indexOf("Provinciale") > -1 ? "PROV" : "LIGA",
        division: parseInt(
          xmlEvent.EventName.substr(0, xmlEvent.EventName.indexOf("e"))
        ),
        type: "COMPETITION"
      });
      console.debug(
        `Processing event`,
        `${event.league} ${event.division}`,
        event.id
      );

      try {
        if (!Array.isArray(xmlEvent.Division)) {
          xmlEvent.Division = [xmlEvent.Division];
        }

        for await (const xmlDivision of xmlEvent.Division) {
          let prefix = xmlDivision.Fixture[0].FixtureTeam1.match(
            /(\b\d{1,2}[GHD])/g
          )[0];
          prefix = prefix.substr(prefix.length - 1);

          let subEvent = await AddSubEvent({
            EventId: event.id,
            poule: xmlDivision.DivisionName,
            type: prefix
          });
          console.log(`Processing subEvent`, subEvent.name, subEvent.id);

          let games = [];
          xmlDivision.Fixture.forEach(ontmoeting => {
            ontmoeting.Match.forEach(game => {
              let gameType;
              switch (game.MatchType) {
                case 1:
                case 2:
                  gameType = "S";
                  break;
                case 3:
                case 4:
                  gameType = "D";
                  break;
                case 5:
                  gameType = "MX";
                  break;
              }

              games.push({
                type: gameType,
                SubEventId: subEvent.id,
                player1Team1Id:
                  parseInt(
                    game.MatchWinner == 1
                      ? game.MatchWinnerLTANo
                      : game.MatchLoserLTANo
                  ) || null,
                player1Team2Id:
                  parseInt(
                    game.MatchWinner == 2
                      ? game.MatchWinnerLTANo
                      : game.MatchLoserLTANo
                  ) || null,
                player2Team1Id:
                  parseInt(
                    game.MatchWinner == 1
                      ? game.MatchWinnerPartnerLTANo
                      : game.MatchLoserPartnerLTANo
                  ) || null,
                player2Team2Id:
                  parseInt(
                    game.MatchWinner == 2
                      ? game.MatchWinnerPartnerLTANo
                      : game.MatchLoserPartnerLTANo
                  ) || null,
                playedAt: new Date(
                  game.MatchYear,
                  game.MatchMonth - 1,
                  game.MatchDay
                ),
                set1_team1: game.MatchTeam1Set1,
                set1_team2: game.MatchTeam1Set2,
                set2_team1: game.MatchTeam2Set1,
                set2_team2: game.MatchTeam2Set2,
                set3_team1: game.MatchTeam3Set1,
                set3_team2: game.MatchTeam3Set2
              });
            });
          });
          console.log(`Adding ${games.length} games`);
          await AddGames(games);
        }
      } catch (error) {
        console.error("Something went wrong", error);
        throw error;
      }
    }
    console.info("Finished import");

    return "All good";
  } catch (e) {
    console.error("Some ting wrong", e);
    return e;
  }
}

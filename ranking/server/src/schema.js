import { gql } from 'apollo-server';

const gameBasic = `
  id: ID!
  playedAt: Date
  type: GameTypeEnum

  player1_team1: Player
  player2_team1: Player

  player1_team2: Player
  player2_team2: Player

  set1_team1: Int
  set1_team2: Int

  set2_team1: Int
  set2_team2: Int

  set3_team1: Int
  set3_team2: Int

  SubEvent: SubEvent
`;

module.exports = gql`
  scalar Date
  enum EventTypeEnum {
    COMPETITION
    TOERNAMENT
  }

  enum EventLeagueEnum {
    PROV
    LIGA,
    BASIC
  }

  enum SubEventTypeEnum {
    G
    D
    H
  }

  enum GenderEnum {
    M
    F
  }

  enum GameTypeEnum{
    S
    D
    MX
  }

  enum RankingTypeEnum{
    CURRENT
    LFBB
  }

  type Player {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String
    gender: GenderEnum
    games: PlayerGameList
    teams: [Team]
    rankings: [Ranking]
    ranking: RankingNumbers
  }

  type RankingNumbers {
    singlePoints: Int
    mixPoints: Int
    doublePoints: Int
    single: String
    mix: String
    double: String
  }

   type Game {
    ${gameBasic}
  }

  type PlayerGame {
    event: SubEvent
    won: Boolean
    team1: Boolean
    partner: Player
    opponent: Player
    opponentPartner: Player
    ${gameBasic}
  }

  type SubEvent {
    id: ID!
    poule: String!
    Event: Event
    teams: [Team]
    type: SubEventTypeEnum
    draw: String
  }

  type Event {
    id: ID!
    subEvents: [SubEvent]
    division: String
    type: EventTypeEnum
    league: EventLeagueEnum
    name: String
  }

  type Team {
    id: ID!
  }

  type Ranking {
    type: RankingTypeEnum
    Player: Player
    points: Int
    Game: Game
  }

  type PlayerList {
    count: Int
    result: [PlayerListPlayer]!
  }

  type GameList {
    count: Int
    result: [Game]!
  }

  type PlayerGameList {
    count: Int
    result: [PlayerGame]!
  }

  type PlayerListPlayer {
    id: ID!
    fullName: String
  }

  type Query {
    player(id: ID!): Player
    players(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      limit: Int
      """
      The number of result to skip, Default = 0
      """
      skip: Int
      """
      Search on a specific value
      """
      search: String
    ): PlayerList!
    game(id: ID!): Game
    games(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      limit: Int
      """
      The number of result to skip, Default = 0
      """
      skip: Int
    ): GameList!
    event(id: ID!): Event
    events: [Event!]!
  }
`;

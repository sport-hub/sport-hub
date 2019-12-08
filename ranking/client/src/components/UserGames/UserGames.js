import { ListItemAvatar, makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import React from "react";
import { Link } from "react-router-dom";
import UserGamesStyle from "./UserGamesStyle";
import Moment from "react-moment";

const useStyles = makeStyles(UserGamesStyle);

export function UserGames(props) {
  const classes = useStyles();

  function playerNames(player, partner, won) {
    let p;
    if (partner) {
      p = (
        <span>
          {" / "}
          <Link to={`/user/${partner.id}`}>{partner.fullName}</Link>
        </span>
      );
    }

    if (player) {
      return (
        <div className={won ? classes.won : classes.lost} id="test">
          <Link to={`/user/${player.id}`}>{player.fullName}</Link>
          {p}
        </div>
      );
    } else {
      return (
        <div className={won ? classes.won : classes.lost} id="test">
          Bye
        </div>
      );
    }
  }

  function playerScores(game, team1) {
    const set1 = (
      <span
        className={
          (game.set1_team1 > game.set1_team2
          ? team1
          : !team1)
            ? classes.won
            : classes.lost
        }
      >
        {team1 ? game.set1_team1 : game.set1_team2}
      </span>
    );
    const set2 = (
      <span
        className={
          (game.set2_team1 > game.set2_team2
          ? team1
          : !team1)
            ? classes.won
            : classes.lost
        }
      >
        {team1 ? game.set2_team1 : game.set2_team2}
      </span>
    );
    let set3;

    if (game.set3_team1) {
      set3 = (
        <span
          className={
            (game.set3_team1 > game.set3_team2
            ? team1
            : !team1)
              ? classes.won
              : classes.lost
          }
        >
          {team1 ? game.set3_team1 : game.set3_team2}
        </span>
      );
    }

    return (
      <div>
        {set1} {set2} {set3}
      </div>
    );
  }

  
  var results = props.games && props.games.length > 0 ? props.games.result
    .sort(x => x.playedAt)
    .reduce(function(acc, item) {
      (acc[item.playedAt] = acc[item.playedAt] || []).push(item);
      return acc;
    }, {}): [];

  const entries = Object.entries(results).map(([key, result]) => {
    return (
      <React.Fragment key={key}>
        <ListItem component="div" className={classes.listItem}>
          <div className={classes.draw}>
            <div className={classes.drawName}>{result[0].SubEvent.draw}</div>
            <div className={classes.drawDate}><Moment fromNow>{key}</Moment></div>
          </div>
          {result.map((game, key2) => (
            <div className={classes.result} key={key2}>
              <ListItemAvatar>
                <Avatar
                  className={game.won ? classes.avatarWon : classes.avatarLost}
                >
                  {game.won ? "W" : "L"}
                </Avatar>
              </ListItemAvatar>

              <div className={classes.names}>
                <div className={classes.top}>
                  {playerNames(props.player, game.partner, game.won)}
                </div>
                <div className={classes.bottom}>
                  {playerNames(game.opponent, game.opponentPartner, !game.won)}
                </div>
              </div>
              <div className={classes.scores}>
                <div className={classes.top}>
                  {playerScores(game, game.team1)}
                </div>
                <div className={classes.bottom}>
                  {playerScores(game, !game.team1)}
                </div>
              </div>
            </div>
          ))}
        </ListItem>
      </React.Fragment>
    );
  });

  if (!results) return <div>loading </div>;
  return (
    <div className={classes.root}>
      <List dense={true} component="div">
        {entries}
      </List>
      {/* <code>{JSON.stringify(results, null, 4)}</code> */}
    </div>
  );
}

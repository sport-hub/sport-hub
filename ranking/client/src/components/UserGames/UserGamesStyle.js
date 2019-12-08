import { green, grey, red } from "@material-ui/core/colors";
import { title } from "assets/jss/material-kit-react";

const UserGamesStyle = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
    backgroundColor: theme.palette.background.paper,
    "& a": {
      color: "rgba(0,0,0,0.87)",
      textDecoration: "none"
    }
  },
  avatarWon: {
    margin: 10,
    color: "#fff",
    backgroundColor: green[500]
  },
  avatarLost: {
    margin: 10,
    color: "#fff",
    backgroundColor: red[500]
  },

  won: {
    fontWeight: "bold"
  },
  lost: {},
  top: {
    borderBottom: 1,
    borderBottomStyle: "solid",
    borderBottomColor: grey[200]
  },
  names: {
    width: 350,
    "& div": { paddingRight: 5 }
  },
  scores: {
    borderLeft: 1,
    borderLeftStyle: "solid",
    borderLeftColor: grey[200],
    "& div": { paddingLeft: 5 }
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  draw: {
    display: "flex",
    marginLeft: 40
  },
  drawName: {
    ...title,
    margin: "0 0.25rem 0 0"
  },
  drawDate: {
    fontSize: "65%",
    fontWeight: "400",
    lineHeight: "1",
    color: "#777"
  },
  result: {
    display: "flex"
  }
});

export default UserGamesStyle;

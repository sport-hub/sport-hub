// @material-ui/core components
import { useQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
// nodejs library that concatenates classes
import classNames from "classnames";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavBar from "components/NavBar/NavBar";
import { loader } from "graphql.macro";
import React from "react";
import profilePageStyle from "./ProfilePageStyle";
import { UserGames } from "components/UserGames/UserGames";

// Graphql queries
const GetUserInfoQuery = loader("../../graphql/queries/GetUserInfoQuery.graphql");
 
// Styles
const useStyles = makeStyles(profilePageStyle);

export default function ProfilePage(props) {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GetUserInfoQuery, {
    variables: { userId: props.match.params.userId }
  });

  let content;
  if (loading) {
    content = <p>loading</p>;
  } else if (!loading && error) {
    content = <p>Something went wrong :(</p>
  } else {

    content = (
      <div className={classes.profile}>
        <div className={classes.picture}>
          {data.player.firstName[0]}
          {data.player.lastName[0]}
        </div>
        <div className={classes.name}>
          <h3 className={classes.title}>{data.player.fullName}</h3>
          <h6>
            {data.player.ranking.single} - {data.player.ranking.double} -{" "}
            {data.player.ranking.mix}
          </h6>
        </div>

        <UserGames player={{ fullName: data.player.fullName, id: data.player.id }} games={data.player.games}></UserGames>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={12}>
                {content}
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

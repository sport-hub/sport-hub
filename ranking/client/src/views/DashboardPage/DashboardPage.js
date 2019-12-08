// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// nodejs library that concatenates classes
import classNames from "classnames";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavBar from "components/NavBar/NavBar";
import React from "react";
import UserSearch from "components/UserSearch/UserSearch";
import DashboardPageStyle from "./DashboardPageStyle";

const useStyles = makeStyles(DashboardPageStyle);

export default function DashboardPage() {
  const classes = useStyles();

  return (
    <div>
      <NavBar />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <h2>Search your player</h2>
                <div className={classes.search}>
                  <UserSearch />
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

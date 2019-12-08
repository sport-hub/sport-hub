// @material-ui/core components
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// nodejs library that concatenates classes
import classNames from "classnames";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavBar from "components/NavBar/NavBar";
import React from "react";
import AdminPageStyle from "./AdminPageStyle";
import axios from "axios";

const useStyles = makeStyles(AdminPageStyle);
const initialState = {
  sync: false,
  reset: false,
  force: false,
  import: false
}

export default function AdminPage() {
  const classes = useStyles();
  const [actions, setActions] = React.useState(initialState);

  async function checkSomething(event) {
    event.preventDefault();

    console.log(actions);

    if (actions.reset) {
      if (actions.sync) {
        await axios.get(
          `http://${process.env.REACT_APP_SERVER_IP}:${
            process.env.REACT_APP_SERVER_PORT
          }/sync${actions.force ? "?force=true" : ""}`
        );
      } else {
        await axios.get(
          `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/cleanup`
        );
      }
    }

    if (actions.import) {
      await axios.get(
        `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/import`
      );
    }
  }

  async function calculateRanking(event) {
    event.preventDefault();
    await axios.get(
      `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/calculate`
    );
  }

  function handleChange(event) {
    event.preventDefault();
    setActions({ ...actions, [event.target.name]: event.target.checked });
  }

  return (
    <div>
      <NavBar />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem>
                <h2>Admin</h2>
                <form onSubmit={checkSomething}>
                  <FormControl component="fieldset">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox name="reset" onChange={handleChange} />
                        }
                        label="Reset"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox name="sync" onChange={handleChange} />
                        }
                        disabled={!actions.reset}
                        label="Sync"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox name="force" onChange={handleChange} />
                        }
                        disabled={!actions.sync}
                        label="Force"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="import"
                            onChange={handleChange}
                          />
                        }
                        label="Import"
                      />
                    </FormGroup>
                    <Button type="submit" color="primary" variant="outlined">
                      Populate
                    </Button>
                  </FormControl>
                </form>

                <Button
                  onClick={calculateRanking}
                  color="primary"
                  variant="outlined"
                >
                  calculateRanking
                </Button>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

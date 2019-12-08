// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import profileImage from "assets/img/faces/avatar.jpg";
import styles from "assets/jss/components/navBarStyle";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Header from "components/Header/Header.js";
import React from "react";
import UserSearch from "components/UserSearch/UserSearch";

const useStyles = makeStyles(styles);

export default function NavBar(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div className={classes.header}>
      <Header
        brand="Ranking simulation"
        color="primary"
        fixed
        rightLinks={
          <div className={classes.headerOptionsRight}>
            <UserSearch />
            <CustomDropdown
              left
              caret={false}
              dropdownHeader="Dropdown Header"
              buttonText={
                <img src={profileImage} className={classes.img} alt="profile" />
              }
              buttonProps={{
                className: classes.navLink + " " + classes.imageDropdownButton,
                color: "transparent"
              }}
              dropdownList={["Me", "Settings and other stuff", "Sign out"]}
            />
          </div>
        }
        {...rest}
      />
    </div>
  );
}

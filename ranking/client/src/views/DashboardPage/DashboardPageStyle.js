import { container, title } from "assets/jss/material-kit-react.js";
import headerLinksStyle from "assets/jss/components/headerLinksStyle";

const DashboardPageStyle = theme => ({
  container,
  title,
  profile: {
    textAlign: "center",
    transform: "translate3d(0, -80px, 0)",
    "& img": {
      maxWidth: "160px",
      width: "100%",
      margin: "0 auto"
    }
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "0 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  search: {
    margin: "0 0 50px"
  },
  ...headerLinksStyle(theme)
});

export default DashboardPageStyle;

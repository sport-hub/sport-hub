const UserSearchStyle = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    top: 48
  },
  suggestion: {
    display: "block",
    color: "#000",
    "& div": {
      width: "100%"
    }
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  suggestionItem: {
    whiteSpace: "pre"
  }
});

export default UserSearchStyle;

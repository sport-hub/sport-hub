import { Paper, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ApolloClient from "apollo-boost";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { loader } from "graphql.macro";
import deburr from "lodash/deburr";
import React from "react";
import Autosuggest from "react-autosuggest";
import UserSearchStyle from "./UserSearchStyle";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "react-apollo";

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.fullName;
}

const client = new ApolloClient({
  uri: `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/graphql`
});

const GetUserInfoQuery = loader(
  "../../graphql/queries/GetPlayersQuery.graphql"
);

const useStyles = makeStyles(UserSearchStyle);

export default function UserSearch() {
  const history = useHistory();
  const classes = useStyles();
  const [state, setState] = React.useState({
    single: ""
  });
  const [stateSuggestions, setSuggestions] = React.useState([]);
  const [
    loadPlayers,
    { called, data: playerSearchResult, refetch, error }
  ] = useLazyQuery(GetUserInfoQuery, {
    variables: { search: "" },
    client
  });

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (_, { suggestion }) => {
    history.push(`/user/${suggestion.id}`);
  };

  const handleChange = name => (_, { newValue }) => {
    setState({
      ...state,
      [name]: newValue
    });
  };

  const renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.fullName, query);
    const parts = parse(suggestion.fullName, matches);
    if (error) return <p>ERROR: {error.message}</p>;

    return (
      <MenuItem selected={isHighlighted} component="div">
        {parts.map(part => (
          <span
            className={classes.suggestionItem}
            key={part.text}
            style={{ fontWeight: part.highlight ? 600 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </MenuItem>
    );
  };

  const getSuggestions = value => {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength < 2) return [];
    if (!called) {
      loadPlayers({ search: value });
    } else {
      refetch({ search: value });
    }

    return inputLength === 0 || !playerSearchResult
      ? []
      : playerSearchResult.players.result;
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    onSuggestionSelected,
    getSuggestionValue,
    renderSuggestion
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          label: "Player",
          value: state.single,
          onChange: handleChange("single")
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    </div>
  );
}

import "assets/scss/material-kit-react.scss?v=1.8.0";
import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Route, Router, Switch } from "react-router-dom";
import DashboardPage from "views/DashboardPage/DashboardPage";
import ProfilePage from "views/ProfilePage/ProfilePage";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache, ApolloClient, HttpLink } from "apollo-boost";
import AdminPage from "views/AdminPage/AdminPage";

var hist = createBrowserHistory();
const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/graphql`
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router history={hist}>
      <Switch>
        <Route path="/user/:userId" component={ProfilePage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/" component={DashboardPage} />
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);

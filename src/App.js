import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import StartPage from "./pages/Interface/Start";
import ErrorPage from './pages/Interface/Error';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/:kid">
          <StartPage />
        </Route>
        <Route path="/">
          <ErrorPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

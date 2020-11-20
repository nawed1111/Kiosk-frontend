import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { AuthContext } from "./context/auth-context";

import StartPage from "./pages/Interface/Start";
import ErrorPage from "./pages/Interface/Error";

import { useAuth } from "./hooks/auth-hook";

function App() {
  const { token, userId, login, logout } = useAuth(); //custom useAuth hook
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
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
    </AuthContext.Provider>
  );
}

export default App;

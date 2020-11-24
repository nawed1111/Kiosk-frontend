import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { AuthContext } from "./context/auth-context";

import StartPage from "./pages/Interface/Start";
import ErrorPage from "./pages/Interface/Error";

import { useAuth } from "./hooks/auth-hook";

import DashboardPage from "./pages/Dashboard/Dashboard";

function App() {
  const { token, user, login, logout } = useAuth(); //custom useAuth hook

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        user,
        login,
        logout,
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route exact path="/:kid">
            <StartPage />
          </Route>
          <Route exact path="/:kid/admin">
            <DashboardPage />
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

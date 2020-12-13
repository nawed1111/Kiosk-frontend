import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { MediaContextProvider } from "./util/media";
import "./App.css";

import { AuthContext } from "./context/auth-context";

import StartPage from "./pages/Interface/Start";
import ErrorPage from "./pages/Interface/Error";

import { useAuth } from "./hooks/auth-hook";
// import { useAxios } from "./hooks/authService";
import DashboardPage from "./pages/Dashboard/Dashboard";

import { Container, Segment } from "semantic-ui-react";

function App() {
  const { token, user, login, logout } = useAuth();
  // const { setInterceptors, getAxiosInstance } = useAxios();

  return (
    <MediaContextProvider>
      <AuthContext.Provider
        value={{
          user,
          isLoggedIn: !!token,
          login,
          logout,
        }}
      >
        <Container textAlign="center">
          <Segment padded style={{ backgroundColor: "#0F2B43" }}>
            <BrowserRouter>
              <Switch>
                <Route exact path="/admin">
                  <DashboardPage />
                </Route>
                <Route exact path="/:kid">
                  <StartPage />
                </Route>
                <Route path="/">
                  <ErrorPage />
                </Route>
                <Redirect to="/" />
              </Switch>
            </BrowserRouter>
          </Segment>
        </Container>
      </AuthContext.Provider>
    </MediaContextProvider>
  );
}

export default App;

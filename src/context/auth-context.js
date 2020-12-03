import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  login: () => {},
  logout: () => {},
});

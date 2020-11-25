import jwtDecode from "jwt-decode";
import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [user, setUser] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback((token, expirationDate) => {
    setToken(token);

    // Decoding token to access the payload data and set to user
    const decodedToken = jwtDecode(token);

    setUser(decodedToken.user);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // token expiry is set to 1 hour
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "token",
      JSON.stringify({
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remianingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remianingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("token"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { user, token, login, logout };
};

import jwtDecode from "jwt-decode";
import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [accessToken, setaccessToken] = useState(null);
  const [refreshToken, setrefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback((accessToken, refreshToken, expirationDate) => {
    setaccessToken(accessToken);
    setrefreshToken(refreshToken);
    // Decoding token to access the payload data and set user
    const payload = jwtDecode(accessToken);
    // console.log("Payload", payload);
    setUser(payload.user);
    // console.log("Date", new Date(payload.exp * 1000));
    const tokenExpirationDate = expirationDate || new Date(payload.exp * 1000);
    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "token",
      JSON.stringify({
        accessToken,
        refreshToken,
        exp: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setaccessToken(null);
    setrefreshToken(null);
    setUser(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    if (accessToken && refreshToken && tokenExpirationDate) {
      const remianingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remianingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [accessToken, refreshToken, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("token"));
    // console.log("Stored", storedData);
    if (
      storedData &&
      storedData.accessToken &&
      storedData.refreshToken &&
      new Date(storedData.exp) > new Date()
    ) {
      login(
        storedData.accessToken,
        storedData.refreshToken,
        new Date(storedData.exp)
      );
    }
  }, [login]);

  return { user, accessToken, refreshToken, login, logout };
};

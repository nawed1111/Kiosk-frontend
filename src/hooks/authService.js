import { useCallback } from "react";
import axios from "axios";

export const useAxios = () => {
  const getAxiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_KIOSK_BACKEND_BASEURL}`,
  });

  const setInterceptors = useCallback(() => {
    getAxiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        if (!err.response)
          return new Promise((resolve, reject) => {
            reject(err);
          });
        return new Promise((resolve, reject) => {
          const originalReq = err.config;

          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            originalReq._retry = true;

            return fetch(
              `${process.env.REACT_APP_KIOSK_BACKEND_BASEURL}/api/auth/refresh-token`,

              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  refreshToken: JSON.parse(localStorage.getItem("token"))
                    .refreshToken,
                }),
              }
            )
              .then((res) => res.json())
              .then((res) => {
                if (res.error && res.error.status === 401) {
                  localStorage.removeItem("token");
                  window.location.reload();
                  return;
                }
                console.log("***Kiosk token generated using Refresh Token***");

                localStorage.setItem(
                  "token",
                  JSON.stringify({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                  })
                );
                originalReq.headers[
                  "Authorization"
                ] = `Bearer ${res.accessToken}`;
                return resolve(axios(originalReq));
              });
          }

          return Promise.reject(err);
        });
      }
    );
  }, [getAxiosInstance]);

  return { getAxiosInstance, setInterceptors };
};

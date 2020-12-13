import Axios from "axios";

const axios = Axios.create({
  baseURL: `${process.env.REACT_APP_KIOSK_BACKEND_BASEURL}`,
});

axios.interceptors.request.use(
  function (config) {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) config.headers["Authorization"] = `Bearer ${token.accessToken}`;
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
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
              return window.location.reload();
            }
            console.log("***Kiosk token generated using Refresh Token***");

            localStorage.setItem(
              "token",
              JSON.stringify({
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
              })
            );

            originalReq.headers["Authorization"] = `Bearer ${res.accessToken}`;
            return resolve(axios(originalReq));
          });
      }

      return reject(err);
    });
  }
);

export default axios;

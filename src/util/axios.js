import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

const storedData = JSON.parse(localStorage.getItem("token"));
let refreshToken;
if (storedData) refreshToken = storedData.refreshToken;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return new Promise((resolve, reject) => {
      const originalReq = err.config;
      if (
        err.response.status === 401 &&
        err.config &&
        !err.config.__isRetryRequest
      ) {
        originalReq._retry = true;

        let res = fetch("http://localhost:5000/api/auth/refresh-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: refreshToken,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("Response from refresh", res);
            localStorage.setItem(
              "token",
              JSON.stringify({
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
              })
            );
            return axios(originalReq);
          });

        resolve(res);
      }
      return reject(err); //modified
    });
  }
);

export default axiosInstance;

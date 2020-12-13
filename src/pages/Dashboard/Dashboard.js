import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "../../util/axios";

import Kiosks from "./Kiosks/Kiosks";
import Admin from "./Admins/Admin";

import { AuthContext } from "../../context/auth-context";
import Can from "../../components/Can/Can";
import LoginForm from "../../components/Login/LoginForm";

const DashboardPage = () => {
  const auth = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState(null);

  const logoutHandler = async () => {
    try {
      await axios.delete(
        `/api/auth/logout`,
        {
          data: {
            refreshToken: JSON.parse(localStorage.getItem("token"))
              .refreshToken,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      auth.logout();
      window.location.reload();
    } catch (error) {
      console.log(error);
      auth.logout();
      window.location.reload();
    }
  };

  const submitClickHandler = async (userid, password) => {
    try {
      const response = await axios.post(
        "/api/auth/admin/login",
        { userid, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(responseData);
      auth.login(response.data.accessToken, response.data.refreshToken);

      userid = "";
      password = "";
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <>
      {!auth.user ? (
        <LoginForm handleLogin={submitClickHandler} />
      ) : (
        <Can
          role={auth.user.role}
          perform="dashboard-page:visit"
          yes={() => (
            <div>
              <button onClick={logoutHandler}>Logout</button>
              <p />
              <h1>Dashboard</h1>
              <button onClick={() => setSelectedTab("kiosks")}>Kiosks</button>
              <button onClick={() => setSelectedTab("users")}>Admins</button>
              {selectedTab === "kiosks" ? (
                <Kiosks />
              ) : selectedTab === "users" ? (
                <Admin />
              ) : undefined}
            </div>
          )}
          no={() => <Redirect to={`/`} />}
        />
      )}
    </>
  );
};

export default DashboardPage;

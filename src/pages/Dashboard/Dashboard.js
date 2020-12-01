import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import Kiosks from "./Kiosks/Kiosks";
import Users from "./Users/Users";

import { AuthContext } from "../../context/auth-context";
import Can from "../../components/Can/Can";
import LoginForm from "../../components/Login/LoginForm";

const _KIOSK_ID = localStorage.getItem("kioskId");

const DashboardPage = () => {
  const auth = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState(null);

  const submitClickHandler = async (username, password) => {
    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert("For admin only");
        throw new Error(responseData.message);
      }
      // console.log(responseData);
      auth.login(responseData.token);

      username = "";
      password = "";
    } catch (err) {
      console.log(err);
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
              <button onClick={() => auth.logout()}>Logout</button>
              <p />
              <h1>Dashboard</h1>
              <button onClick={() => setSelectedTab("kiosks")}>Kiosks</button>
              <button onClick={() => setSelectedTab("users")}>Users</button>
              {selectedTab === "kiosks" ? (
                <Kiosks />
              ) : selectedTab === "users" ? (
                <Users />
              ) : undefined}
            </div>
          )}
          no={() => <Redirect to={`/${_KIOSK_ID}`} />}
        />
      )}
    </>
  );
};

export default DashboardPage;

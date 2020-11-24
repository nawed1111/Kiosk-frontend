import React, { useContext } from "react";
import { Redirect, Link } from "react-router-dom";

import Kiosks from "./Kiosks";
import Users from "./Users";

import { AuthContext } from "../../context/auth-context";
import Can from "../../components/Can/Can";

const _KIOSK_ID = localStorage.getItem("kioskId");

const DashboardPage = () => {
  const auth = useContext(AuthContext);
  return (
    <Can
      role={auth.user.role}
      perform="dashboard-page:visit"
      yes={() => (
        <div>
          <h1>Dashboard</h1>
          <Kiosks />
          <Users />
          <Link to={`/${_KIOSK_ID}`}>
          <button>Go Back</button>
          </Link>
        </div>
      )}
      no={() => <Redirect to={`/${_KIOSK_ID}`} />}
    />
  );
};

export default DashboardPage;

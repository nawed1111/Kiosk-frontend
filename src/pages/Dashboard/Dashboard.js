import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import Kiosks from "./Kiosks/Kiosks";
import Users from "./Users";

import { AuthContext } from "../../context/auth-context";
import Can from "../../components/Can/Can";

const _KIOSK_ID = localStorage.getItem("kioskId");

const DashboardPage = (props) => {
  const auth = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState(null);

  // const goBackClickHandler = () => {
  //   props.goBack();
  // };

  return (
    <>
      <Can
        role={auth.user.role}
        perform="dashboard-page:visit"
        yes={() => (
          <div>
            <p />
            <nav>
              <button onClick={() => setSelectedTab("kiosks")}>Kiosks</button>
              <button onClick={() => setSelectedTab("users")}>Users</button>
            </nav>
            <h1>Dashboard</h1>
            {selectedTab === "kiosks" ? (
              <Kiosks />
            ) : selectedTab === "users" ? (
              <Users />
            ) : undefined}
          </div>
        )}
        no={() => <Redirect to={`/${_KIOSK_ID}`} />}
      />
      {/* <button onClick={goBackClickHandler}>Go Back</button> */}
    </>
  );
};

export default DashboardPage;

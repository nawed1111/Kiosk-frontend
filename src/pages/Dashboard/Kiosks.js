import React, { useEffect, useContext, useState } from "react";

import { AuthContext } from "../../context/auth-context";

function Kiosks() {
  const auth = useContext(AuthContext);
  const [kiosks, setKiosks] = useState([]);

  useEffect(() => {
    let page = 1;
    async function helper() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/kiosks?page=${page}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setKiosks(responseData.kiosks);
      } catch (error) {
        console.log(error);
      }
    }
    helper();
  }, [auth.token]);

  const renderKiosks = kiosks.map((kiosk, index) => (
    <div key={kiosk._id}>
      <p>
        <strong>({index + 1})</strong>Kiosk ID: {kiosk.kioskId}
      </p>
      <p>Instruments:</p>
      {kiosk.instruments.map((instrument, index) => (
        <div key={instrument._id}>
          <p>
            <strong>{index + 1}.</strong>
            {instrument._id}
          </p>
        </div>
      ))}
      <p>Created on: {kiosk.created}</p>
      <p>Last Updated: {kiosk.updated}</p>
    </div>
  ));

  return (
    <div>
      <h3>Available Kiosks</h3>
      {renderKiosks}
    </div>
  );
}

export default Kiosks;

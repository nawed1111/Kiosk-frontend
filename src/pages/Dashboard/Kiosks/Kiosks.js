import React, { useEffect, useContext, useState } from "react";

import { AuthContext } from "../../../context/auth-context";

import KioskForm from "./KioskForm";

function Kiosks() {
  const auth = useContext(AuthContext);
  const [kiosks, setKiosks] = useState([]);
  const [selectedKiosk, setSelectedKiosk] = useState({
    kioskId: "",
    rfreader: "",
    instruments: [],
    samplesInTest: [],
  });
  const [kioskOperation, setKioskOperation] = useState(false);

  useEffect(() => {
    let page = 1;
    async function helper() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/kiosks?page=${page}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.accessToken,
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
  }, [auth.token, kioskOperation]);

  const renderKiosks = kiosks.map((kiosk, index) => (
    <div key={kiosk._id}>
      <p>
        <strong>({index + 1})</strong>
        {kiosk.kioskId}
        <button
          onClick={() => {
            setKioskOperation(true);
            setSelectedKiosk(kiosk);
          }}
        >
          Edit
        </button>
      </p>
    </div>
  ));

  return (
    <div>
      <h3>Available Kiosks</h3>
      {renderKiosks}
      <p />
      {kioskOperation ? (
        <KioskForm
          kiosk={selectedKiosk}
          goBack={() => setKioskOperation(!kioskOperation)}
        />
      ) : undefined}
      <button
        onClick={() => {
          setKioskOperation(!kioskOperation);
          setSelectedKiosk({
            kioskId: "",
            rfreader: "",
            instruments: [],
            samplesInTest: [],
          });
        }}
      >
        {kioskOperation ? "Cancel" : "Add a kiosk"}
      </button>
    </div>
  );
}

export default Kiosks;

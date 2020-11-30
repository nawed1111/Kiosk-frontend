import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../context/auth-context";

function Users() {
  const auth = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function helper() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        // console.log(responseData);
        setUsers(responseData.users);
      } catch (error) {
        console.log(error);
      }
    }
    helper();
  }, [auth.token]);

  const renderUsers = users.map((user, index) => (
    <div key={`${user._id}${index}`}>
      <p>
        <strong>({index + 1})</strong>
        User ID: {user.userId}
      </p>
      <p>Role: {user.role}</p>
    </div>
  ));

  return (
    <div>
      <h2>Users:</h2>
      {renderUsers}
    </div>
  );
}

export default Users;

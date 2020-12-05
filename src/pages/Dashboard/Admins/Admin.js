import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../../context/auth-context";
import AdminForm from "./AdminForm";

function Users() {
  const auth = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState({});
  // userid: "",
  // role: "",
  // fanme: "",
  // lname: "",
  // email: "",
  const [userOperation, setUserOperation] = useState(false);

  useEffect(() => {
    async function helper() {
      try {
        const response = await auth.getAxiosInstance.get(
          "/api/auth/admin-list",
          {
            headers: {
              Authorization: "Bearer " + auth.accessToken,
            },
          }
        );
        setUsers(response.data.users);
      } catch (error) {
        console.log(error.response);
      }
    }
    helper();
  }, [auth]);

  const renderUsers = users.map((user, index) => (
    <div key={`${user.userid}${index}`}>
      <p>
        <strong>({index + 1})</strong>
        {user.userid}
      </p>
      <p>Role: {user.role}</p>
      <button
        onClick={() => {
          setUserOperation(true);
          setSelectedUser(user);
        }}
      >
        Edit
      </button>
    </div>
  ));

  return (
    <div>
      <h2>Users:</h2>
      {renderUsers}
      <p />
      {userOperation ? (
        <AdminForm
          user={selectedUser}
          goBack={() => setUserOperation(!userOperation)}
        />
      ) : undefined}
      <button
        onClick={() => {
          setUserOperation(!userOperation);
          setSelectedUser({});
        }}
      >
        {userOperation ? "Cancel" : "Create a User"}
      </button>
    </div>
  );
}

export default Users;

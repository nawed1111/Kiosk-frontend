import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../../context/auth-context";
import UserForm from "./UserForm";

function Users() {
  const auth = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState({
    userId: "",
    role: "",
    firstTimeLogin: true,
    locked: false,
  });
  const [userOperation, setUserOperation] = useState(false);

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
      <button
        onClick={() => {
          setUserOperation(!userOperation);
          setSelectedUser({
            id: "",
            role: "",
            firstTimeLogin: true,
            locked: false,
          });
        }}
      >
        {userOperation ? "Cancel" : "Create a User"}
      </button>
      {userOperation ? (
        <UserForm
          user={selectedUser}
          goBack={() => setUserOperation(!userOperation)}
        />
      ) : undefined}
    </div>
  );
}

export default Users;

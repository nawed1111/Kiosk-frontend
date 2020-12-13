import React, { useState, useEffect } from "react";

import axios from "../../../util/axios";
import AdminForm from "./AdminForm";

function Users() {
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
        const response = await axios.get("/api/auth/admin-list");
        setUsers(response.data.users);
      } catch (error) {
        console.log(error.response);
      }
    }
    helper();
  }, []);

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

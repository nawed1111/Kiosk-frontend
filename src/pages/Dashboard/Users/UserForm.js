import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/auth-context";

function UserForm(props) {
  const editUser = props.user;
  const auth = useContext(AuthContext);
  const [fetchedUsers, setfetchedUsers] = useState([]);

  const fetchUsersInputHandler = async (event) => {
    event.preventDefault();
    try {
      const response = fetch("http://localhost:5000/api/auth/users", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setfetchedUsers(responseData.users);
    } catch (error) {
      console.log(error);
    }
  };

  const userOperationHandler = async (event) => {
    // console.log(newKiosk);
    event.preventDefault();

    const { userId, role, firstTimeLogin, locked } = event.target;

    let method;

    if (editUser.userId) method = "PATCH";
    else method = "PUT";

    console.log(
      userId.value,
      role.value,
      firstTimeLogin.checked,
      locked.checked
    );
    /*
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/create-user/${userId.value}`,
        {
          method: method,
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role.value,
            firstTimeLogin: firstTimeLogin.checked,
            locked: locked.checked,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      window.alert(responseData.message);
      props.goBack();
    } catch (error) {}
    */
  };

  const datalist = fetchedUsers.map((user, index) => (
    <option key={`${user.id}${index}`} value={user.username} />
  ));

  return (
    <div>
      User Form
      <p />
      <form onSubmit={(event) => userOperationHandler(event)}>
        <label>
          User ID:
          <input
            list="users"
            name="userId"
            placeholder="username/user-id"
            value={editUser.userId}
            readOnly={editUser.userId}
            onChange={(event) => fetchUsersInputHandler(event)}
          />
        </label>
        <datalist id="users">{datalist}</datalist>
        <p />
        <label>
          Role:
          <select name="role">
            <option
              value="standard-user"
              selected={editUser.role === "standard-user"}
            >
              Standard User
            </option>
            {/* <option value="admin" selected={editUser.role === "admin"}>
              Admin
            </option> */}
          </select>
        </label>
        <p />
        <label>
          First Time Login:
          <input
            name="firstTimeLogin"
            type="checkbox"
            defaultChecked={editUser.firstTimeLogin}
          />
        </label>
        <p />
        <label>
          Locked:
          <input
            name="locked"
            type="checkbox"
            defaultChecked={editUser.locked}
          />
        </label>
        <p />
        <button>{editUser.userId ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default UserForm;

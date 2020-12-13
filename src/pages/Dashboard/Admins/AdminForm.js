import React from "react";
import axios from "../../../util/axios";

function UserForm(props) {
  const editUser = props.user;

  const userOperationHandler = async (event) => {
    event.preventDefault();

    const {
      userid,
      fname,
      lname,
      password,
      confirmp,
      email,
      role,
      countryCode,
      mob,
    } = event.target;
    if (password.value !== confirmp.value)
      return window.alert("Passwords donot match!");
    let method, url;

    if (editUser.userid) {
      method = "PATCH";
      url = `/api/auth/admin/${userid}`;
    } else {
      method = "POST";
      url = `/api/auth/admin`;
    }

    console.log(method);

    try {
      const response = await axios({
        method,
        url,
        data: {
          userid: userid.value,
          fname: fname.value,
          lname: lname.value,
          role: role.value,
          password: password.value,
          email: email.value,
          countrycode: Number(countryCode.value),
          mobno: Number(mob.value),
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.alert(response.data.message);
      props.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Admin Form
      <p />
      <form onSubmit={(event) => userOperationHandler(event)}>
        <label>
          User ID:
          <input
            list="users"
            name="userid"
            placeholder="username/user-id"
            defaultValue={editUser.userid}
            readOnly={editUser.userid}
          />
        </label>
        <p />
        <label>
          Role:
          <select name="role" defaultValue={editUser.role}>
            <option value="admin">Admin</option>
          </select>
        </label>
        <p />
        <label>
          First Name:
          <input
            name="fname"
            placeholder="first name"
            defaultValue={editUser.fname}
            required
          />
        </label>
        <p />
        <label>
          Last Name:
          <input
            name="lname"
            placeholder="last name"
            defaultValue={editUser.lname}
            required
          />
        </label>
        <p />
        <label>
          Password:
          <input
            name="password"
            type="password"
            placeholder="password"
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            name="confirmp"
            type="password"
            placeholder="confirm password"
            required
          />
        </label>
        <p />
        <label>
          Email:
          <input
            name="email"
            placeholder="email"
            defaultValue={editUser.email}
            required
          />
        </label>
        <p />
        <label>
          Country Code:
          <input
            type="number"
            name="countryCode"
            placeholder="country code"
            defaultValue={editUser.countrycode}
            size="5"
          />
        </label>
        <label>
          Mobile:
          <input
            type="number"
            name="mob"
            placeholder="mobile"
            defaultValue={editUser.mobno}
          />
        </label>
        <button>{editUser.userid ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default UserForm;

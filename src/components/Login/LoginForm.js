import React from "react";

function LoginForm(props) {
  const loginClickHandler = (event) => {
    event.preventDefault();
    const {
      target: { userid, password },
    } = event;
    props.handleLogin(userid.value, password.value);
  };
  return (
    <div>
      <h2>Login with your crdentials</h2>
      <form onSubmit={(event) => loginClickHandler(event)}>
        <label>
          User ID:
          <input name="userid" required />
        </label>

        <br />
        <label>
          Password:
          <input name="password" type="password" required />
        </label>
        <br />
        <input type="submit" value="Login" />
      </form>
      <br />
    </div>
  );
}

export default LoginForm;

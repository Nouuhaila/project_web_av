import React, { useState } from "react";
import axios from "axios";
import "./Login.scss";
import { getBaseURL } from "../apiConfig";

function Login(props) {
  let [uname, setUname] = useState("");
  let [password, setPass] = useState("");
  let [error, setError] = useState("");

  // Click handler for login
  function handleClick() {
    if (validateInputs()) {
      const user = {
        email: uname,
        password: password,
      };
      let url = `${getBaseURL()}api/users/login`;

      axios
        .post(url, { ...user })
        .then((res) => {
          console.log("API Response:", res.data);

          if (res.data.length > 0) {
            console.log("Logged in successfully");

            // Store user data
            const userData = {
              userId: res.data[0].userId, // User ID
              isAdmin: parseInt(res.data[0].isAdmin, 10), // Parse isAdmin to ensure it's an integer
            };

            console.log("User Data to Store:", userData); // Debug log

            // Store user information in sessionStorage
            sessionStorage.setItem("isUserAuthenticated", true);
            sessionStorage.setItem("customerId", userData.userId);
            sessionStorage.setItem("user", JSON.stringify(userData));

            // Update authentication state
            props.setUserAuthenticatedStatus(userData.isAdmin, userData.userId);
          } else {
            console.log("User not available");
            setError("Invalid email or password.");
          }
        })
        .catch((err) => {
          console.error("Error during login:", err);
          setError("An error occurred during login. Please try again.");
        });
    }
  }

  // Validate email format
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Validate password length
  function validatePassword(password) {
    return password.length >= 6;
  }

  // Validate inputs
  function validateInputs() {
    if (!validateEmail(uname)) {
      setError("Please provide a valid email address.");
      return false;
    } else if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  }

  // Handle changes in email input
  function changeName(event) {
    setUname(event.target.value);
  }

  // Handle changes in password input
  function changePass(event) {
    setPass(event.target.value);
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div>
        <label>E-Mail</label>
        <input type="text" value={uname} onChange={changeName}></input>
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={changePass}
        ></input>
      </div>
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleClick}>Login</button>
      <div className="register-link" onClick={() => props.navigateToRegisterPage()}>
        Is New User
      </div>
    </div>
  );
}

export default Login;

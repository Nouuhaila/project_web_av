import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.scss";
import LoginRegisterForm from "./components/LoginRegisterContainer/LoginRegisterContainer";
import AdminCustomerContainer from "./components/AdminCustomerContainer/AdminCustomerContainer";
import SellerContainer from "./components/SellerContainer/SellerContainer";
import ProfileUpdate from "./components/ProfileUpdate/ProfileUpdate";

function App() {
  const [isUserAuthenticated, setUserAuthorization] = useState(
    sessionStorage.getItem("isUserAuthenticated") === "true" || false
  );
  const [isAdmin, setAdmin] = useState(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user?.isAdmin || 0; // Default to 0 if no user is found
  });
  const [customerId, setCustomerId] = useState(
    sessionStorage.getItem("customerId") || undefined
  );

  const setUserAuthenticatedStatus = (isAdmin, customerId) => {
    setUserAuthorization(true);
    setAdmin(isAdmin); // Ensure isAdmin is stored as an integer
    setCustomerId(customerId);

    // Update sessionStorage
    sessionStorage.setItem(
      "user",
      JSON.stringify({ userId: customerId, isAdmin })
    );
    sessionStorage.setItem("isUserAuthenticated", true);
    sessionStorage.setItem("customerId", customerId);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isUserAuthenticated");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("customerId");

    setUserAuthorization(false);
    setAdmin(0);
    setCustomerId(undefined);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isUserAuthenticated ? (
              <LoginRegisterForm setUserAuthenticatedStatus={setUserAuthenticatedStatus} />
            ) : (
              <>
                <div className="login-button-container">
                  <button
                    onClick={() => {
                      const userId = sessionStorage.getItem("customerId");
                      window.location.href = `/update-profile?userId=${userId}`;
                    }}
                    className="login-button"
                  >
                    Update Profile
                  </button>
                </div>
                <div className="login-button-container">
                  <button onClick={handleLogout} className="login-button">
                    Logout
                  </button>
                </div>
                {isAdmin === 2 ? (
                  <SellerContainer isAdmin={isAdmin} />
                ) : (
                  <AdminCustomerContainer isAdmin={isAdmin} customerId={customerId} />
                )}
              </>
            )
          }
        />
        <Route path="/update-profile" element={<ProfileUpdate />} />
      </Routes>
    </Router>
  );
}

export default App;

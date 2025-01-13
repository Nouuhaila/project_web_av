import React, { useState, useEffect } from "react";
import CustomerProductList from "../ProductList/CustomerProductList";
import CustomerOrders from "./CustomerOrders";
import AdminOrderList from "../Orders/AdminOrderList"; // Importez la liste des commandes
import "./CustomerContainer.scss";

const CustomerContainer = (props) => {
  const [isProductsActive, setIsProductsActive] = useState(true);
  const [showOrderList, setShowOrderList] = useState(false); // État pour la liste des commandes

  // Vérifiez la valeur de `props.isAdmin` et l'utilisateur stocké dans sessionStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Récupère l'utilisateur depuis sessionStorage
    console.log("CustomerContainer - user from sessionStorage:", user);
    console.log("CustomerContainer - props.isAdmin:", props.isAdmin);
  }, [props.isAdmin]);

  const changeList = () => {
    setIsProductsActive(!isProductsActive);
  };

  const toggleOrderList = () => {
    setShowOrderList(!showOrderList);
  };

  return (
    <div className="customer-container">
      <div>
        {isProductsActive ? (
          <>
            <button onClick={changeList}>Get My Past Orders</button>
            <div className="list-container">
              <CustomerProductList />
            </div>
          </>
        ) : (
          <>
            <button onClick={changeList}>Product List</button>
            <div className="list-container">
              <CustomerOrders />
            </div>
          </>
        )}
      </div>

      {/* Afficher le bouton et la liste des commandes pour les vendeurs */}
      {props.isAdmin === 2 && (
        <div className="order-list-section">
          <button onClick={toggleOrderList}>
            {showOrderList ? "Hide Order List" : "Show Order List"}
          </button>
          {showOrderList && (
            <div className="list-container">
              <AdminOrderList /> {/* Affichez la liste des commandes */}
            </div>
          )}
        </div>
      )}

      
    </div>
  );
};

export default CustomerContainer;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import CustomerProductList from "../ProductList/CustomerProductList";
import CustomerOrders from "../CustomerContainer/CustomerOrders"; // Liste des commandes utilisateur
import "./SellerContainer.scss";

const SellerContainer = (props) => {
  const [isProductsActive, setIsProductsActive] = useState(true);
  const [showOrderList, setShowOrderList] = useState(false); // État pour la liste des commandes
  const [orders, setOrders] = useState([]); // Liste des commandes pour le vendeur

  // Charger les commandes
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get(`${getBaseURL()}api/orders`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.log("Couldn't receive order list:", err));
  };

  const validateOrder = (orderId) => {
    axios
      .put(`${getBaseURL()}api/orders/validate/${orderId}`)
      .then(() => {
        alert("Order validated successfully.");
        fetchOrders(); // Rafraîchir la liste des commandes
      })
      .catch((err) => console.log("Couldn't validate order:", err));
  };

  const cancelOrder = (orderId) => {
    axios
      .put(`${getBaseURL()}api/orders/cancel/${orderId}`)
      .then(() => {
        alert("Order canceled successfully.");
        fetchOrders();
      })
      .catch((err) => console.log("Couldn't cancel order:", err));
  };

  const deleteOrder = (orderId) => {
    axios
      .delete(`${getBaseURL()}api/orders/delete/${orderId}`)
      .then(() => {
        alert("Order deleted successfully.");
        fetchOrders(); // Rafraîchir la liste des commandes
      })
      .catch((err) => console.log("Couldn't delete order:", err));
  };

  const changeList = () => {
    setIsProductsActive(!isProductsActive);
  };

  const toggleOrderList = () => {
    setShowOrderList(!showOrderList);
  };

  return (
    <div className="seller-container">
      <div>
        {/* Section Produits ou Commandes Passées */}
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

      {/* Section Liste des commandes pour le vendeur */}
      <div className="order-list-section">
        <button onClick={toggleOrderList}>
          {showOrderList ? "Hide Order List" : "Show Order List"}
        </button>
        {showOrderList && (
          <div className="list-container">
            <h1>Order List</h1>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.fname}</td>
                    <td>{order.createdDate}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.status}</td>
                    <td>
                      {/* Si la commande est "pending", on affiche Validate & Cancel */}
                      {order.status === "pending" && (
                        <>
                          <button onClick={() => validateOrder(order.orderId)}>
                            Validate
                          </button>
                          <button onClick={() => cancelOrder(order.orderId)}>
                            Cancel
                          </button>
                        </>
                      )}

                      {/* Bouton pour supprimer la commande */}
                      <button onClick={() => deleteOrder(order.orderId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerContainer;

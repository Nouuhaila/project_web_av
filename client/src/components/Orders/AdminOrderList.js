import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./AdminOrderList.scss";

const AdminOrderList = (props) => {
  const [orders, setOrders] = useState([]);

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

  /**
   * Annule la commande (change le statut en 'canceled')
   */
  const cancelOrder = (orderId) => {
    axios
      .put(`${getBaseURL()}api/orders/cancel/${orderId}`)
      .then(() => {
        alert("Order canceled successfully.");
        fetchOrders();
      })
      .catch((err) => console.log("Couldn't cancel order:", err));
  };

  /**
   * Supprime physiquement la commande de la base de données (optionnel)
   */
  const deleteOrder = (orderId) => {
    axios
      .delete(`${getBaseURL()}api/orders/delete/${orderId}`)
      .then(() => {
        alert("Order deleted successfully.");
        fetchOrders(); // Rafraîchir la liste des commandes
      })
      .catch((err) => console.log("Couldn't delete order:", err));
  };

  const openOrderDetails = (order) => {
    props.handleOrderDetails(order);
  };

  return (
    <div>
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
                <button onClick={() => openOrderDetails(order)}>Details</button>
                
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

                {/* Optionnel : Bouton pour supprimer physiquement la commande de la base. */}
                <button onClick={() => deleteOrder(order.orderId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./CustomerOrders.scss";

const CustomerOrders = (props) => {
  const [pastOrders, setPastOrders] = useState([]);
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    axios
      .get(`${getBaseURL()}api/orders/myPastOrders/${customerId}`)
      .then((res) => {
        setPastOrders(res.data);
      })
      .catch((err) => {
        console.log("Error fetching past orders:", err);
      });
  }, [customerId]);

  return (
    <div className="customer-orders-container">
      <h1>Mes Commandes</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Product Name</th>
              <th>Order Date</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th> {/* Nouvelle colonne pour le statut */}
            </tr>
          </thead>
          <tbody>
            {pastOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.name}</td>
                <td>{order.createdDate}</td>
                <td>{order.quantity}</td>
                <td>{order.totalPrice}</td>
                <td>{order.status}</td> {/* Affichage du statut (pending, validated...) */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOrders;

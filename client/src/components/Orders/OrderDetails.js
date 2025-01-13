import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./OrderDetails.scss";

const OrderDetails = (props) => {
  const orderId = props.orderId;
  const [order, setOrder] = useState({});
  const [productsInOrder, setProductsInOrder] = useState([]);

  useEffect(() => {
    // Récupère les informations générales de la commande
    axios
      .get(`${getBaseURL()}api/orders/${orderId}`)
      .then((res) => {
        // On suppose que la réponse est un tableau (res.data[0])
        // ou un objet (res.data) selon votre backend.
        if (res.data && res.data.length > 0) {
          setOrder(res.data[0]);
        } else {
          setOrder({});
        }
      })
      .catch((err) => {
        console.log("Erreur lors de la récupération de la commande :", err);
      });

    // Récupère la liste des produits associés à la commande
    axios
      .get(`${getBaseURL()}api/orders/getProductsByOrder/${orderId}`)
      .then((res) => {
        setProductsInOrder(res.data);
      })
      .catch((err) => {
        console.log("Erreur lors de la récupération des produits :", err);
      });
  }, [orderId]);

  const handleBackClick = () => {
    props.onBackClick(); // Retour à la page précédente
  };

  return (
    <div className="order-details-container">
      <div className="back-button-container">
        <button onClick={handleBackClick}>Back</button>
      </div>

      <div>
        <label>Order Id</label>
        <input type="text" value={orderId} disabled />
      </div>
      <div>
        <label>Customer Name</label>
        <input type="text" value={order.fname || ""} disabled />
      </div>
      <div>
        <label>Total Cost</label>
        <input type="text" value={order.totalPrice || ""} disabled />
      </div>
      <div>
        <label>Order Date</label>
        <input type="text" value={order.createdDate || ""} disabled />
      </div>
      <div>
        <label>Address</label>
        <input type="text" value={order.address || ""} disabled />
      </div>

      <div>
        <h1>Products In the Order</h1>
        <table>
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {productsInOrder.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.stock}</td> {/* Affichage du stock */}
                <td>{product.quantity}</td>
                <td>{product.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;

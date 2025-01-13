import React, { useEffect, useState } from "react";
import axios from "axios";
import OrdersByProductId from "../Orders/OrdersByProductId";
import { getBaseURL } from "../apiConfig";
import "./AdminProductDetails.scss";

const ProductDetails = (props) => {
  const [id, setId] = useState(props.productId);
  const [productDetails, setProductDetails] = useState(true);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDesc] = useState("");
  const [productStock, setProductStock] = useState(0); // État pour le stock

  useEffect(() => {
    axios
      .get(`${getBaseURL()}api/products/${props.productId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const data = res.data[0];
          setProductName(data.name);
          setProductPrice(data.price);
          setProductDesc(data.description);
          setProductStock(data.stock); // Récupération du stock
          setProductDetails(true);
        } else {
          setProductDetails(false);
        }
      })
      .catch((err) => {
        console.log("Sorry couldn't fetch details", err);
        setProductDetails(false);
      });
  }, [props.productId]);

  const saveProduct = () => {
    const productData = {
      id: props.productId,
      name: productName,
      price: productPrice,
      description: productDesc,
      stock: productStock, // Inclure le stock dans l'objet à envoyer
    };

    axios
      .post(`${getBaseURL()}api/products/update`, productData)
      .then((res) => {
        alert("Product updated successfully!"); // Alerte pour succès
        console.log("Product updated successfully");
      })
      .catch((err) => {
        alert("Error updating product. Please try again."); // Alerte pour erreur
        console.error("Error updating product:", err);
      });
  };


  const handleBackClickToProductList = () => {
    props.onBackClick();
  };

  return (
    <div className="product-details-container">
      <div className="top-right">
        <button onClick={handleBackClickToProductList}>Back</button>
      </div>
      {productDetails ? (
        <>
          <input
            type="text"
            value={props.productId}
            disabled
            placeholder="Product Id"
          />
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name"
          />
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Price"
          />
          <input
            type="text"
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            placeholder="Description"
          />
          <input
            type="text"
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            placeholder="Stock"
          />
          <button onClick={saveProduct}>Save</button>
        </>
      ) : (
        <p>Product not found.</p>
      )}

      {/* Affichage des commandes liées à ce produit */}
      <OrdersByProductId productId={props.productId} />
    </div>
  );
};

export default ProductDetails;

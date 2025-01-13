import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./AdminProductList.scss";

const ProductList = (props) => {
  console.log("isAdmin prop in ProductList:", props.isAdmin);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDesc] = useState("");
  const [productStock, setProductStock] = useState(0);

  // Fonction pour ajouter un produit
  const addProduct = () => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Récupère les informations utilisateur stockées

    

    const name = productName;
    const price = productPrice;
    const description = productDesc;
    const stock = productStock;

    if (name !== "" && price > 0 && description !== "" && stock >= 0) {
      axios
        .post(`${getBaseURL()}api/products/create`, {
          isAdmin: user.isAdmin, // Inclure le rôle utilisateur dans la requête
          name,
          price,
          description,
          stock,
        })
        .then(() => {
          console.log("Product added successfully.");
          fetchProducts();
          setProductName(""); // Réinitialise les champs
          setProductPrice(0);
          setProductDesc("");
          setProductStock(0);
        })
        .catch((err) => {
          console.log("Error adding product:", err);
          alert("An error occurred while adding the product.");
        });
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  // Fonction pour récupérer la liste des produits
  const fetchProducts = () => {
    axios
      .get(`${getBaseURL()}api/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log("Error fetching product list:", err);
      });
  };

  // Chargement initial des produits
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fonction pour afficher les détails d’un produit
  const openProductDetails = (product) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log("User info in openProductDetails:", user); // Vérifie les données utilisateur
    console.log("User info in openProductDetails:", user.isAdmin);
    if (user && user.isAdmin === 1) {
      props.handleProductDetails(product);
    } else {
      alert("Access denied: Only admins can view product details.");
    }
  };
  
  
  

  // Fonction pour supprimer un produit
  const deleteProduct = (productId) => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Récupère les informations utilisateur

    if (user?.isAdmin !== 1) {
      alert("Access denied: Only admins can delete products.");
      return;
    }

    axios
      .delete(`${getBaseURL()}api/products/delete/${productId}`, {
        data: { isAdmin: user.isAdmin },
      })
      .then(() => {
        console.log("Product deleted successfully.");
        fetchProducts();
      })
      .catch((err) => {
        console.log("Error deleting product:", err);
        alert("An error occurred while deleting the product.");
      });
  };

  return (
    <div className="product-list-container">
      <div className="add-product-section">
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
        />

        <label htmlFor="productPrice">Price:</label>
        <input
          type="number"
          id="productPrice"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Price"
        />

        <label htmlFor="productDesc">Description:</label>
        <input
          type="text"
          id="productDesc"
          value={productDesc}
          onChange={(e) => setProductDesc(e.target.value)}
          placeholder="Description"
        />

        <label htmlFor="productStock">Stock:</label>
        <input
          type="number"
          id="productStock"
          value={productStock}
          onChange={(e) => setProductStock(e.target.value)}
          placeholder="Stock"
        />

        <button onClick={addProduct}>Add Product</button>
      </div>

      <div className="product-list">
        <h1>Product List</h1>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Created Date</th>
              <th>Details</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td>{product.stock}</td>
                <td>{product.createdDate}</td>
                <td>
                  <button onClick={() => openProductDetails(product)}>Details</button>
                </td>
                <td>
                  <button onClick={() => deleteProduct(product.productId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;

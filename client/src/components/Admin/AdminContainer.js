// AdminContainer.js

import React, { useState } from "react";
import AdminProductDetails from "../AdminProductDetails/AdminProductDetails";
import ProductList from "../ProductList/AdminProductList";
import AdminOrderList from "../Orders/AdminOrderList";
import OrderDetails from "../Orders/OrderDetails";
import "./AdminContainer.scss";

const AdminContainer = (props) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductList, setShowProductList] = useState(true);

  const handleProductDetails = (product) => {
    if (props.isAdmin == 1) { // Autorisation uniquement pour les administrateurs
      setSelectedProduct(product);
    } else {
      alert("Access denied: Only admins can view product details.");
    }
  };

  return (
    <div className="admin-container">
      {selectedProduct ? (
        <div className="details-container">
          <AdminProductDetails
            productId={selectedProduct.productId}
            onBackClick={() => setSelectedProduct(null)}
          />
        </div>
      ) : (
        <>
          <div>
            {showProductList ? (
              <div className="product-list-container">
                {props.isAdmin == 1 && ( // Le bouton pour afficher la liste des commandes est restreint aux administrateurs
                  <button onClick={() => setShowProductList(false)}>
                    Get Order List
                  </button>
                )}
                <ProductList
                  isAdmin={props.isAdmin}
                  handleProductDetails={handleProductDetails}
                  
                />


              </div>
            ) : (
              <div className="order-list-container">
                {selectedOrder ? (
                  <div className="details-container">
                    <OrderDetails
                      orderId={selectedOrder.orderId}
                      onBackClick={() => setSelectedOrder(null)}
                    />
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setShowProductList(true)}>
                      Get Product List
                    </button>
                    <AdminOrderList
                      handleOrderDetails={setSelectedOrder}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminContainer;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import ShoppingCart from "../ShopingCart/ShoppingCart";

const ProductListCustomer = (props) => {
  const [productList, setProductList] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const customerId = sessionStorage.getItem("customerId");
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Récupération des produits
    axios
      .get(`${getBaseURL()}api/products`)
      .then((res) => {
        const productsWithQuantity = res.data.map((product) => ({
          ...product,
          quantity: 0, // Ajout de la propriété quantity pour chaque produit
        }));

        // Récupération du panier
        axios
          .get(`${getBaseURL()}api/cart/${customerId}`)
          .then((responseCart) => {
            setCartProducts(responseCart.data);
            setProductList(productsWithQuantity);
          })
          .catch((err) => console.error("Error fetching cart data:", err));
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [customerId]);

  /**
   * Ajouter un produit au panier
   */
  const addToCart = (product) => {
    if (product.quantity > 0) {
      if (product.quantity <= product.stock) {
        // Copie locale du panier
        const updatedCartList = [...cartProducts];
        const existingProductIndex = updatedCartList.findIndex(
          (p) => p.productId === product.productId
        );

        if (existingProductIndex !== -1) {
          // Produit déjà présent dans le panier, mise à jour de la quantité
          updatedCartList[existingProductIndex].quantity += product.quantity;
        } else {
          // Produit non trouvé dans le panier, ajout
          updatedCartList.push({ ...product });
        }

        // Appel API pour ajouter au panier
        axios
          .post(`${getBaseURL()}api/cart/add`, {
            customerId,
            productId: product.productId,
            quantity: product.quantity,
            isPresent: existingProductIndex !== -1,
          })
          .then(() => {
            // Mise à jour du stock local et réinitialisation de la quantité
            const updatedProductList = productList.map((p) =>
              p.productId === product.productId
                ? { ...p, stock: p.stock - product.quantity, quantity: 0 }
                : p
            );

            setProductList(updatedProductList);
            setCartProducts(updatedCartList);
          })
          .catch((error) => console.error("Error adding to cart:", error));
      } else {
        alert(
          `Stock insuffisant. Vous pouvez ajouter un maximum de ${product.stock} article(s) pour ce produit.`
        );
      }
    } else {
      alert("Veuillez entrer une quantité valide.");
    }
  };

  /**
   * Supprimer un produit du panier
   */
  const removeProduct = (productId) => {
    axios
      .delete(`${getBaseURL()}api/cart/remove/${productId}/${customerId}`)
      .then(() => {
        const updatedCartList = cartProducts.filter(
          (product) => product.productId !== productId
        );
        setCartProducts(updatedCartList);
        console.log("Product removed successfully.");
      })
      .catch((err) => console.error("Error removing product:", err));
  };

  /**
   * Mettre à jour la quantité d'un produit avant de l'ajouter au panier
   */
  const updateProductQuantity = (e, productId) => {
    const newQuantity = parseInt(e.target.value, 10);

    const updatedList = productList.map((product) => {
      if (product.productId === productId) {
        // Vérifier qu'on ne dépasse pas le stock
        if (newQuantity <= product.stock) {
          product.quantity = newQuantity;
        } else {
          alert(
            `Stock insuffisant. Vous pouvez ajouter un maximum de ${product.stock} article(s).`
          );
          product.quantity = product.stock; // Limiter la quantité au stock disponible
        }
      }
      return product;
    });

    setProductList(updatedList);
  };

  /**
   * Valider l'achat (création de la commande côté backend avec status = "pending")
   */
  const buyProducts = () => {
    if (address !== "") {
      axios
        .post(`${getBaseURL()}api/cart/buy/${customerId}`, { address })
        .then(() => {
          // Panier vidé localement
          setCartProducts([]);
          setAddress("");
          alert(
            "Commande passée avec succès !\nVotre commande est en attente de validation par l'administrateur."
          );
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert("Session expirée. Veuillez vous reconnecter.");
          } else {
            console.error("Erreur lors de la commande :", error);
          }
        });
    } else {
      alert("Veuillez entrer une adresse pour la livraison.");
    }
  };

  /**
   * Mettre à jour l'adresse depuis un composant enfant (ShoppingCart)
   */
  const updateAddress = (updatedAddress) => {
    setAddress(updatedAddress);
  };

  return (
    <>
      <div className="product-list-container">
        <div>
          <h1>Liste des produits</h1>
        </div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Quantité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <input
                    type="number"
                    value={product.quantity}
                    min="0"
                    placeholder="Quantité"
                    onChange={(e) => updateProductQuantity(e, product.productId)}
                  />
                </td>
                <td>
                  <button onClick={() => addToCart(product)}>
                    Ajouter au panier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Affichage du panier et possibilité de passer la commande */}
      <ShoppingCart
        cartProducts={cartProducts}
        removeProduct={removeProduct}
        buyProducts={buyProducts}
        address={props.address}
        updateAddress={updateAddress}
      />
    </>
  );
};

export default ProductListCustomer;

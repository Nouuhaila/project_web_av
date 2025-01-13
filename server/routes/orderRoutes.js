const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Récupère toutes les commandes
router.get("/", orderController.getAllOrders);

// Récupère les commandes passées par un client
router.get("/myPastOrders/:customerId", orderController.getPastOrdersByCustomerID);

// Récupère la liste des produits associés à une commande
router.get("/getProductsByOrder/:id", orderController.getProductsByOrder);

// Met à jour une commande existante
router.put("/update/:id", orderController.updateOrder);

// Valide une commande
router.put("/validate/:id", orderController.validateOrder);

// Annule une commande
router.put("/cancel/:id", orderController.cancelOrder);

// **Supprime physiquement la commande**
router.delete("/delete/:id", orderController.deleteOrder);

// Récupère les détails d'une commande par ID (placé en dernier)
router.get("/:id", orderController.getOrderById);

module.exports = router;

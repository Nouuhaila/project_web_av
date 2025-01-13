const orderModel = require("../models/orderModel");

/**
 * Récupère toutes les commandes
 */
exports.getAllOrders = (req, res) => {
  orderModel
    .getAllOrders()
    .then((result) => {
      res.json(result); // Vous pouvez utiliser res.send(result) si vous préférez
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Error fetching orders.");
    });
};

/**
 * Récupère une commande par son ID
 */
exports.getOrderById = (req, res) => {
  const orderId = req.params.id;
  orderModel
    .getOrderById(orderId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Error fetching order.");
    });
};

/**
 * Récupère les produits liés à une commande
 */
exports.getProductsByOrder = (req, res) => {
  const orderId = req.params.id;
  orderModel
    .getProductsByOrder(orderId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Error fetching products by order.");
    });
};

/**
 * Met à jour une commande (champs divers ou statut)
 */
exports.updateOrder = (req, res) => {
  const orderId = req.params.id;
  const newData = req.body; // Exemple : { status: "validated" }
  orderModel
    .updateOrder(orderId, newData)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Error updating order.");
    });
};

/**
 * Récupère les commandes passées d'un client
 * (Assurez-vous que la route est déclarée comme /myPastOrders/:customerId)
 */
exports.getPastOrdersByCustomerID = (req, res) => {
  // On récupère :customerId depuis req.params
  // Vérifiez bien que dans vos routes, c'est "myPastOrders/:customerId"
  const customerId = req.params.customerId;
  orderModel
    .getPastOrdersByCustomerID(customerId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Error fetching past orders.");
    });
};

/* -------------------------------------------------------------------------
   Fonctions supplémentaires pour valider ou annuler une commande
   (nécessitent des routes PUT /validate/:id et PUT /cancel/:id)
   ------------------------------------------------------------------------- */

/**
 * Valide une commande (status = "validated")
 */
exports.validateOrder = (req, res) => {
  const orderId = req.params.id;
  orderModel
    .updateOrder(orderId, { status: "validated" })
    .then((result) => {
      res.json({ message: "Order validated successfully.", result });
    })
    .catch((err) => {
      console.error("Error validating order:", err);
      res.status(500).send("Error validating order.");
    });
};

/**
 * Annule une commande (status = "canceled")
 */
exports.cancelOrder = (req, res) => {
  const orderId = req.params.id;
  orderModel
    .updateOrder(orderId, { status: "canceled" })
    .then((result) => {
      res.json({ message: "Order canceled successfully.", result });
    })
    .catch((err) => {
      console.error("Error canceling order:", err);
      res.status(500).send("Error canceling order.");
    });
};

/**
 * Supprime physiquement la commande (et éventuellement ses produits)
 */
exports.deleteOrder = (req, res) => {
    const orderId = req.params.id;
    
    orderModel
      .deleteOrder(orderId)
      .then(() => {
        res.json({ message: "Order deleted successfully." });
      })
      .catch((err) => {
        console.error("Error deleting order:", err);
        res.status(500).send("Error deleting order.");
      });
  };
  
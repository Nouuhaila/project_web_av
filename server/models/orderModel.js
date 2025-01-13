const pool = require("../database/connection");

/**
 * Récupère toutes les commandes avec leur statut
 */
exports.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        O.orderId, 
        U.fname, 
        U.lname, 
        O.createdDate, 
        O.totalPrice, 
        O.status
      FROM orders O
      INNER JOIN users U ON O.userId = U.userId
    `;
    pool.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Récupère les détails d'une commande par son ID
 */
exports.getOrderById = (orderId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        U.fname,
        U.lname,
        O.totalPrice,
        O.createdDate,
        O.address,
        O.status
      FROM orders O
      INNER JOIN users U ON O.userId = U.userId
      WHERE O.orderId = ?
    `;
    pool.query(query, [orderId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Récupère la liste des produits associés à une commande
 */
exports.getProductsByOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        P2.productId, 
        P2.name,
        P2.stock,            /* Ajoutez stock si nécessaire */
        P.quantity,
        P.totalPrice,
        O.status
      FROM orders O
      INNER JOIN productsInOrder P ON O.orderId = P.orderId
      INNER JOIN product P2 ON P.productId = P2.productId
      WHERE O.orderId = ?
    `;
    pool.query(query, [orderId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Met à jour une commande avec de nouvelles données (par exemple le statut)
 */
exports.updateOrder = (orderId, newData) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE orders SET ? WHERE orderId = ?`;
    pool.query(query, [newData, orderId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Récupère toutes les commandes passées par un utilisateur
 */
exports.getPastOrdersByCustomerID = (customerId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        O.orderId,
        P.name,
        O.createdDate,
        PIN.quantity,
        PIN.totalPrice,
        O.status
      FROM orders O
      INNER JOIN productsInOrder PIN ON O.orderId = PIN.orderId
      INNER JOIN product P ON PIN.productId = P.productId
      WHERE O.userId = ?
      ORDER BY O.orderId DESC
    `;
    pool.query(query, [customerId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
/**
 * Supprime physiquement la commande de la base de données
 */
exports.deleteOrder = (orderId) => {
    return new Promise((resolve, reject) => {
      // 1) Si vous voulez seulement supprimer la commande :
      const query = "DELETE FROM orders WHERE orderId = ?";
  
      // 2) Si vous devez aussi supprimer les lignes dans productsInOrder :
      // const query = `
      //   DELETE FROM productsInOrder WHERE orderId = ?;
      //   DELETE FROM orders WHERE orderId = ?;
      // ` (MySQL n’accepte pas plusieurs requêtes d'un coup sans paramétrage spécial,
      //    vous devrez donc soit exécuter deux pool.query, soit activer "multipleStatements".)
  
      pool.query(query, [orderId], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  };
  
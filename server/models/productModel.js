const pool = require("../database/connection");

exports.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM product;", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.getProductDetailsById = (productId) => {
    return new Promise((resolve, reject) => {
        const query =
            "SELECT * FROM product WHERE productId = ?";
        pool.query(query, [productId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.allOrderByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        const query =
            "SELECT O.orderId, U.fname, U.lname, O.createdDate, PIN.quantity, PIN.totalPrice " +
            "FROM users U INNER JOIN orders O on U.userId  = O.userId " +
            "INNER JOIN productsInOrder PIN on O.orderId = PIN.orderId " +
            "INNER JOIN product P on PIN.productId = P.productId " +
            "WHERE PIN.productId = ?;";

        pool.query(query, [productId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
exports.createProduct = (name, price, description, stock) => {
    console.log("Données reçues pour insertion :", { name, price, description, stock });
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO product (name, price, description, stock) VALUES (?, ?, ?, ?)",
            [name, price, description, stock],
            (err, result) => {
                if (err) {
                    console.error("Erreur SQL :", err.message);
                    reject(err);
                } else {
                    console.log("Insertion réussie :", result);
                    resolve(result);
                }
            }
        );
    });
};


exports.updateProduct = (productId, name, price, description, stock) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE product SET name = ?, price = ?, description = ?, stock = ? WHERE productId = ?",
            [name, price, description, stock, productId],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

exports.deleteProduct = (productId) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM product WHERE productId = ?", [productId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

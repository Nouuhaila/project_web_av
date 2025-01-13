const productModel = require("../models/productModel");

exports.getAllProducts = (req, res) => {
    productModel.getAllProducts()
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

exports.getProductDetailsById = (req, res) => {
    const productId = req.params.id;
    productModel.getProductDetailsById(productId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error fetching product.");
        });
};

exports.allOrderByProductId = (req, res) => {
    const productId = req.params.id;
    productModel.allOrderByProductId(productId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error fetching product.");
        });
};

exports.createProduct = (req, res) => {
    const { name, price, description, stock } = req.body; // Inclure le champ stock
    productModel.createProduct(name, price, description, stock) // Passer le stock au modèle
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error creating product.");
        });
};


exports.updateProduct = (req, res) => {
    const { isAdmin } = req.body;
  
    if (isAdmin !== 1) {
      return res.status(403).json({ message: "Access denied: Only admins can update products." });
    }
  
    const { id, name, price, description, stock } = req.body;
    productModel
      .updateProduct(id, name, price, description, stock)
      .then((result) => {
        res.status(200).json({ message: "Product updated successfully.", result });
      })
      .catch((err) => {
        console.error(err.message);
        res.status(500).json({ error: "Error updating product." });
      });
  };

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    productModel.deleteProduct(productId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error deleting product.");
        });
};

  

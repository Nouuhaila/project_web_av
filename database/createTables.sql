CREATE TABLE users (
	userId INT(5) AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(30) NOT NULL,
	lname VARCHAR(30) NOT NULL,
	email VARCHAR(50),
    password VARCHAR(200),
    isAdmin BOOL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product (
	productId INT(5) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TINYTEXT,
    price DECIMAL(10,2),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shopingCart (
	userId INT(5),
    productId INT(5),
    quantity INT,
    PRIMARY KEY (userId, productId) 
);

CREATE TABLE orders (
	orderId INT(10) AUTO_INCREMENT PRIMARY KEY,
    userId INT(5),
    address VARCHAR(500),
    totalPrice DECIMAL(10,2),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productsInOrder (
	orderId INT(5),
    productId INT(5),
    quantity INT,
    totalPrice DECIMAL(10,2),
    PRIMARY KEY (orderId, productId) 
);


ALTER TABLE shopingCart
ADD FOREIGN KEY (userId) REFERENCES users (userId),
ADD FOREIGN KEY (productId) REFERENCES product (productId);

ALTER TABLE orders
ADD FOREIGN KEY (userId) REFERENCES users (userId);

ALTER TABLE productsInOrder
ADD FOREIGN KEY (orderId) REFERENCES orders (orderId),
ADD FOREIGN KEY (productId) REFERENCES product (productId);
ALTER TABLE users ADD address VARCHAR(255) AFTER lname;
ALTER TABLE product ADD stock INT DEFAULT 0;
ALTER TABLE orders ADD status VARCHAR(20) DEFAULT 'pending';
UPDATE product
SET stock = stock - (SELECT COALESCE(SUM(quantity), 0)
                     FROM productsInOrder
                     WHERE product.productId = productsInOrder.productId)
WHERE EXISTS (SELECT 1
              FROM productsInOrder
              WHERE product.productId = productsInOrder.productId);

INSERT INTO product (name, description, price, stock) VALUES
('Laptop', 'High-performance laptop for professionals', 999.99, 50),
('Smartphone', 'Latest model with powerful features', 799.99, 100),
('Tablet', 'Lightweight tablet for everyday use', 499.99, 75),
('Headphones', 'Noise-cancelling over-ear headphones', 199.99, 200),
('Smartwatch', 'Stylish smartwatch with fitness tracking', 149.99, 150);
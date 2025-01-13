// userModel.js

const pool = require("../database/connection");
const bcrypt = require('bcryptjs');


exports.register = (email, password, isAdmin, fname, lname) => {
    return new Promise((resolve, reject) => {
        // First, check if the user with the provided email already exists
        pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        // User with this email already exists
                        reject(new Error("User already exists"));
                    } else {
                        // User does not exist, proceed with registration
                        // Hash the password before storing it
                        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                            if (hashErr) {
                                reject(hashErr);
                            } else {
                                // Truncate hashed password to fit into VARCHAR(15) column
                                // const truncatedHashedPassword = hashedPassword.substring(0, 15);
                                pool.query(
                                    "INSERT INTO users (email, password, isAdmin, fname, lname) VALUES (?,?,?,?,?);",
                                    [email, hashedPassword, isAdmin, fname, lname],
                                    (insertErr, result) => {
                                        if (insertErr) {
                                            reject(insertErr);
                                        } else {
                                            resolve(result);
                                        }
                                    }
                                );
                            }
                        });
                    }
                }
            }
        );
    });
};


exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT userId, password, isAdmin FROM users WHERE email = ?;",
            [email],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length === 0) {
                        // No user found with the provided email
                        reject(new Error("Invalid email or password"));
                    } else {
                        const storedHashedPassword = result[0].password;
                        // Compare the provided password with the stored hashed password
                        bcrypt.compare(password, storedHashedPassword, (compareErr, isMatch) => {
                            if (compareErr) {
                                reject(compareErr);
                            } else if (!isMatch) {
                                // Passwords do not match
                                reject(new Error("Invalid email or password"));
                            } else {
                                // Passwords match, authenticate the user
                                let userData = {
                                    userId: result[0].userId,
                                    isAdmin: result[0].isAdmin,
                                }
                                let response = [userData]
                                resolve(response);
                            }
                        });
                    }
                }
            }
        );
    });
};

// userModel.js

// Trouver un utilisateur par son ID
exports.findUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE userId = ?";
    pool.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]); // retourne le premier (et seul) user
    });
  });
};


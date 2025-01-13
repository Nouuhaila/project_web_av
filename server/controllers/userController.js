// userController.js

const userModel = require("../models/userModel");

exports.register = (req, res) => {
    const { email, password, isAdmin, fname, lname } = req.body;
    userModel.register(email, password, isAdmin, fname, lname)
        .then(result => {
            console.log("Successful Register");
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error registering user.");
        });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    userModel.login(email, password)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error logging in.");
        });
};
exports.getUserById = (req, res) => {
    const userId = req.params.id;

    const pool = require("../database/connection");
    pool.query("SELECT fname, lname, address FROM users WHERE userId = ?", [userId], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Error fetching user data.");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found.");
        }
        res.status(200).json(result[0]);
    });
};

exports.updateProfile = async (req, res) => {
    const { userId, fname, lname, address, password } = req.body;

    console.log("Request received with data:", req.body); // Log les données reçues

    try {
        let updateQuery = "UPDATE users SET fname = ?, lname = ?, address = ?";
        let params = [fname, lname, address];

        if (password) {
            const bcrypt = require("bcryptjs");
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery += ", password = ?";
            params.push(hashedPassword);
        }

        updateQuery += " WHERE userId = ?";
        params.push(userId);

        console.log("Query to execute:", updateQuery); // Log la requête SQL
        console.log("Parameters:", params); // Log les paramètres

        const pool = require("../database/connection");
        pool.query(updateQuery, params, (err, result) => {
            if (err) {
                console.error("Error executing query:", err.message); // Log l'erreur
                return res.status(500).send("Error updating profile.");
            }
            if (result.affectedRows === 0) {
                console.warn("No rows affected. UserId may not exist."); // Avertissement si aucun utilisateur trouvé
                return res.status(404).send("User not found.");
            }
            res.status(200).send("Profile updated successfully.");
        });
    } catch (error) {
        console.error("Unexpected error:", error.message); // Log les erreurs inattendues
        res.status(500).send("Error updating profile.");
    }
};



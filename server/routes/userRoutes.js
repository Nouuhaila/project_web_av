// userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route for user registration
router.post("/register", userController.register);

// Route for user login
router.post("/login", userController.login);

//Route get id
router.get("/:id", userController.getUserById);

// Route for updating user profile
router.put("/update-profile", userController.updateProfile);

module.exports = router;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileUpdate.css";


const ProfileUpdate = () => {
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        address: "",
        password: "",
    });

    const userId = sessionStorage.getItem("customerId"); // Récupérer l'ID utilisateur depuis le stockage

    useEffect(() => {
        // Charger les informations existantes de l'utilisateur
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/users/${userId}`);
                setFormData({
                    fname: response.data.fname,
                    lname: response.data.lname,
                    address: response.data.address,
                    password: "", // Le mot de passe reste vide pour la modification
                });
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put("http://localhost:3001/api/users/update-profile", {
                ...formData,
                userId,
            });
            alert(response.data); // Afficher le message de succès
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear(); // Supprime les données de session
        window.location.href = "/"; // Redirige vers la page de connexion
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>First Name:</label>
                <input
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                />
                <label>Last Name:</label>
                <input
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                />
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
                <label>Password (optional):</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Update Profile</button>
            </form>
            <button onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
            <button onClick={() => window.history.back()} style={{ marginLeft: "10px" }}>
                Go Back
            </button>
        </div>
    );
};

export default ProfileUpdate;

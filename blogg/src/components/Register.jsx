import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "", email: ""});
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form data:", formData);
        try {
            const response = await fetch("https://sdcblogproject.onrender.com/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Registration successful!");
                try {
                    const response = await fetch("https://sdcblogproject.onrender.com/api/token/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(credentials),
                    });
        
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        const access = data["Access Token"];
                        const refresh = data["Refresh Token"];
                        props.accessToken = access;
                        localStorage.setItem("access", access); 
                        localStorage.setItem("refresh", refresh);
                        navigate(`/home?access=${access}`);
                    } else {
                        setError("Invalid username or password.");
                    }
                } catch (error) {
                    setError("An error occurred. Please try again later.");
                }
            } else {
                const data = await response.json();
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while registering.");
        }
        
    };

    return (
        <>
            <div className="register-container">
                <form className="registerForm" onSubmit={handleSubmit}>
                    <h3 className="fw-bolder text-center">Register</h3>
                    <div className="input-container">
                        <input
                            type="text"
                            name="username"
                            className="input"
                            placeholder="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="email"
                            name="email"
                            className="input"
                            placeholder="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            name="password"
                            className="input"
                            placeholder="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn bg-light ms-3 fw-bolder">Submit</button>

                    {error && <p className="error-message">{error}</p>}

                    <div className="login d-flex justify-content-center align-items-center ms-3 mt-3">
                        <p>If already registered??</p>
                        <button
                            type="button"
                            className="btn bg-light ms-3 fw-bolder"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;

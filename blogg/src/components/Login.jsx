import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("https://flask-blog-boic.onrender.com/login", {
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
                    localStorage.setItem("access", access); 
                    localStorage.setItem("refresh", refresh);
                    navigate(`/home?access=${access}`);
                } else {
                    setError("Invalid username or password.");
                }
            } catch (error) {
                setError("An error occurred. Please try again later.");
            }
            
        };

    return (
        <div className="register-container">
            <form className="registerForm" onSubmit={handleLogin}>
                <h3 className="fw-bolder text-center">Login</h3>
                <div className="input-container">
                    <input
                        type="text"
                        name="username"
                        className="input"
                        placeholder="username"
                        value={credentials.username}
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
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="text-danger text-center">{error}</p>}
                <button type="submit" className="btn bg-light ms-3 fw-bolder">Login</button>
            </form>
        </div>
    );
};

export default Login;

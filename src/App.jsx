import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import { isLoggedIn, logout } from "./services/api";
import './styles/App.css';

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setAuthenticated(isLoggedIn());
    }, []);

    const handleLogin = () => {
        setAuthenticated(true);
    };

    const handleLogout = () => {
        logout();
        setAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        authenticated ? (
                            <Navigate to="/profile" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/login"
                    element={
                        authenticated ? (
                            <Navigate to="/profile" replace />
                        ) : (
                            <Login onLogin={handleLogin} switchToRegister={() => window.location.href = "/register"} />
                        )
                    }
                />

                <Route
                    path="/register"
                    element={
                        authenticated ? (
                            <Navigate to="/profile" replace />
                        ) : (
                            <Register switchToLogin={() => window.location.href = "/login"} />
                        )
                    }
                />

                <Route
                    path="/profile"
                    element={
                        authenticated ? (
                            <UserProfile onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;





import React, { useState, useEffect } from "react";
import servicesAuth from "../Api/serviceAuth";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await servicesAuth.verifyToken(token);
                if (response.message === 'Token is valid') {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <>Loading...</>;
    }

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to={`/?error=You must log in to access this page.`} />
    );
};

export default Protected;

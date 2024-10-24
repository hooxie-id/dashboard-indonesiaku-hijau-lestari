import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Layout from "../Layouts/Layout";
import Profile from "../Pages/Profile";
import Artikel from "../Pages/Artikel/Artikel";
import AddArtikel from "../Pages/Artikel/AddArtikel";
import Member from "../Pages/Member";
import User from "../Pages/User";
import Protected from "../Components/Protected";
import EditArtikel from "../Pages/Artikel/EditArtikel";

const RouteApp = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* This route only applies the Protected component to the specified paths */}
                <Route element={<Protected />}>
                    <Route path="/home" element={<Layout><Home /></Layout>} />

                    <Route path="/artikel" element={<Layout><Artikel /></Layout>} />
                    <Route path="/artikel/add" element={<Layout><AddArtikel /></Layout>} />
                    <Route path="/artikel/edit/:id" element={<Layout><EditArtikel /></Layout>} />

                    <Route path="/member" element={<Layout><Member /></Layout>} />
                    <Route path="/user" element={<Layout><User /></Layout>} />
                    <Route path="/profil" element={<Layout><Profile /></Layout>} />
                </Route>

                {/* Redirects any undefined route to login or a designated page */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default RouteApp;

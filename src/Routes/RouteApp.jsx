import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Layout from "../Layouts/Layout";
import Profile from "../Pages/Profile";
import Protected from "../Components/Protected";

import Artikel from "../Pages/Artikel/Artikel";
import AddArtikel from "../Pages/Artikel/AddArtikel";
import EditArtikel from "../Pages/Artikel/EditArtikel";

import Member from "../Pages/Member/Member";
import AddMember from "../Pages/Member/AddMember";
import EditMember from "../Pages/Member/EditArtikel";

import User from "../Pages/User/User";
import AddUser from "../Pages/User/AddUser";
import EditUser from "../Pages/User/EditUser";

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
                    <Route path="/member/add" element={<Layout><AddMember /></Layout>} />
                    <Route path="/member/edit/:id" element={<Layout><EditMember /></Layout>} />

                    <Route path="/user" element={<Layout><User /></Layout>} />
                    <Route path="/user/add" element={<Layout><AddUser /></Layout>} />
                    <Route path="/user/edit/:id" element={<Layout><EditUser /></Layout>} />

                    <Route path="/profil" element={<Layout><Profile /></Layout>} />
                </Route>

                {/* Redirects any undefined route to login or a designated page */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default RouteApp;

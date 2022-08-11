import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import Admin from "../pages/admin/admin";
import Employee from "../pages/employee/employee";
function AppRoutes() {
  return (
    /*Routes for login, admin and employee pages */
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/employee" element={<Employee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

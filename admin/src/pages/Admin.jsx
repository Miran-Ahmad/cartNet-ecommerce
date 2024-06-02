import React from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "../components/SideBar";
import AddProduct from "../components/AddProduct";
import ListProduct from "../components/ListProduct";

const Admin = () => {
  return (
    <div className="lg:flex">
      <SideBar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/" element={<ListProduct />} />
      </Routes>
    </div>
  );
};

export default Admin;

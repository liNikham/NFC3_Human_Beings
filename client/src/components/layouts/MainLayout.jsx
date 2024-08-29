/* eslint-disable no-unused-vars */
import React from "react";
// import Navbar from "../headers/Navbar";
import { Outlet } from "react-router-dom";
import NewNab from "../headers/NewNab";
import Footer from "../footers/Footer";
import "./layout.css";
import bgImg from "../../assets/lovely-new-image.jpg";
const MainLayout = () => {
  return (
    //
    <div
      className="font-poppins min-h-screen flex flex-col gradient-background"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundColor: "#0e003f",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <NewNab />
      <div className="flex-grow pt-16"> {/* Add padding-top to account for Navbar height */}
        <div className="flex items-center justify-center h-full">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default MainLayout;

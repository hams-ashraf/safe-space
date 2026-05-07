import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className={`app-layout ${isAuthPage ? "app-layout--auth" : ""}`}>
      <Navbar />
      <div className={isAuthPage ? "auth-outlet" : "container my-4"}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

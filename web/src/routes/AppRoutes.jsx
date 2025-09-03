import React from "react";
import { Routes } from "react-router-dom";
import { publicRoutes } from "./PublicRoutes";
import { adminRoutes } from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {publicRoutes}
      {adminRoutes}
    </Routes>
  );
};

export default AppRoutes;

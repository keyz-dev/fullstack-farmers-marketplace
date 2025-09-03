import React from "react";
import { Route } from "react-router-dom";
import { DashboardLayout } from "../components/layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";

import {
  Dashboard,
  UserApplications,
  Notifications,
  Profile,
  Settings,
  Orders,
  Users,
  Categories,
  Products,
} from "../pages/admin";

export const adminRoutes = [
  <Route
    key="admin"
    path="/admin"
    element={<ProtectedRoute allowedRoles={["admin"]} />}
  >
    <Route element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="user-applications" element={<UserApplications />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="orders" element={<Orders />} />
      <Route path="users" element={<Users />} />
      <Route path="categories" element={<Categories />} />
      <Route path="products" element={<Products />} />
    </Route>
  </Route>,
];

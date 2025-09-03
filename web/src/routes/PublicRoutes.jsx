import { Route } from "react-router-dom";
import {
  Login,
  Register,
  ForgotPassword,
  VerifyAccount,
  ResetPassword,
} from "../pages/auth";
import { AuthLayout } from "../components/layout";

export const publicRoutes = [
  <Route key="auth" path="/" element={<AuthLayout />}>
    <Route index element={<Login />} />
    <Route key="login" path="/login" element={<Login />} />
    <Route key="register" path="/register" element={<Register />} />
    <Route
      key="forgot-password"
      path="/forgot-password"
      element={<ForgotPassword />}
    />
    <Route
      key="verify-account"
      path="/verify-account"
      element={<VerifyAccount />}
    />
    <Route
      key="reset-password"
      path="/reset-password"
      element={<ResetPassword />}
    />
  </Route>,
];

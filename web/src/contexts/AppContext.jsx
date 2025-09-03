import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import { SocketProvider } from "./SocketProvider";
import { LanguageProvider } from "./LanguageContext";

export const AppContext = ({ children }) => (
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

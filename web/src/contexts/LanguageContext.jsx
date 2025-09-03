"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(undefined);

const languageOptions = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "fr",
    name: "Français",
    flag: "🇫🇷",
  },
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    // Check for saved language preference or default to English
    const savedLanguage = localStorage.getItem("language");
    if (
      savedLanguage &&
      languageOptions.some((opt) => opt.code === savedLanguage)
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage);
  };

  const value = {
    language,
    setLanguage,
    languageOptions,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#3B82F6', // Default blue
    fontFamily: 'Inter, sans-serif',
    darkMode: false,
    logo: null,
  });

  // Load theme settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  // Save theme settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));

    // Apply theme to document
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--font-family', theme.fontFamily);

    if (theme.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme(prevTheme => ({ ...prevTheme, ...newTheme }));
  };

  const resetTheme = () => {
    setTheme({
      primaryColor: '#3B82F6',
      fontFamily: 'Inter, sans-serif',
      darkMode: false,
      logo: null,
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

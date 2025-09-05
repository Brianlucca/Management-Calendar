import { createContext, useState } from 'react';

const defaultTheme = {
  footerClass: 'bg-white text-slate-600 border-t border-slate-200',
};

export const PageThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
});

export const PageThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const value = { theme, setTheme, defaultTheme };

  return (
    <PageThemeContext.Provider value={value}>
      {children}
    </PageThemeContext.Provider>
  );
};
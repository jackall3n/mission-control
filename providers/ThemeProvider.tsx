import React, { useEffect, useState } from 'react';

export enum Theme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export type IThemeContext = {
  theme: Theme;
  setTheme(theme: Theme): void;
};

export const ThemeContext = React.createContext<IThemeContext>({
  theme: Theme.DARK,
  setTheme(theme: Theme) {
  }
});

export const useTheme = () => React.useContext(ThemeContext);

export function ThemeProvider({ children }: React.PropsWithChildren<unknown>) {
  const [theme, setTheme] = useState<IThemeContext["theme"]>(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("THEME") as Theme ?? Theme.DARK
    }

    return Theme.DARK
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.body.classList.remove("light")
      window.document.body.classList.remove("dark")
      window.document.body.classList.add(theme.toLowerCase());
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme: Theme.LIGHT,
      setTheme(theme) {
        localStorage.setItem("THEME", theme);

        setTheme(theme);
      }
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;

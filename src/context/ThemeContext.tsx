import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Theme = "light" | "dark"
export type FontSize = "small" | "medium" | "large"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  compactMode: boolean
  setCompactMode: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("portal-theme") as Theme) || "light"
  )
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem("portal-fontsize") as FontSize) || "medium"
  )
  const [compactMode, setCompactMode] = useState<boolean>(
    () => localStorage.getItem("portal-compact") === "true"
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
    localStorage.setItem("portal-theme", theme)
  }, [theme])

  useEffect(() => {
    const sizes: Record<FontSize, string> = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }
    document.documentElement.style.fontSize = sizes[fontSize]
    localStorage.setItem("portal-fontsize", fontSize)
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem("portal-compact", String(compactMode))
  }, [compactMode])

  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"))

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        fontSize,
        setFontSize,
        compactMode,
        setCompactMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme precisa ser usado dentro do ThemeProvider")
  return ctx
}

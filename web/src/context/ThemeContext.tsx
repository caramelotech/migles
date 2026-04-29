import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DARK_THEME, LIGHT_THEME } from '../tokens'
import type { Theme } from '../tokens'

type ThemeContextValue = {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DARK_THEME,
  isDark: true,
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  const theme = isDark ? DARK_THEME : LIGHT_THEME

  useEffect(() => {
    document.body.style.background = theme.bg
    document.body.style.color = theme.text

    let style = document.getElementById('dyn-theme') as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      style.id = 'dyn-theme'
      document.head.appendChild(style)
    }
    style.textContent = isDark
      ? `input::placeholder,textarea::placeholder{color:#4a4760}
         ::-webkit-scrollbar-thumb{background:#2a2a35}
         input[type="date"]::-webkit-calendar-picker-indicator,
         input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(0.5)}`
      : `input::placeholder,textarea::placeholder{color:#b0a8c8}
         ::-webkit-scrollbar-thumb{background:#d4cff0}
         input[type="date"]::-webkit-calendar-picker-indicator,
         input[type="time"]::-webkit-calendar-picker-indicator{filter:none}`
  }, [theme, isDark])

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme: () => setIsDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

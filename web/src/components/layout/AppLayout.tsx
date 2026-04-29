import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  const { theme: T, isDark, toggleTheme } = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: T.bg,
        transition: 'background 0.25s',
      }}
    >
      {!isMobile && <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: isMobile ? 72 : 0 }}>
        <Outlet />
      </main>
      {isMobile && <BottomNav isDark={isDark} onToggleTheme={toggleTheme} />}
    </div>
  )
}

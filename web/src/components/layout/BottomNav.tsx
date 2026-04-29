import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { ThemeToggle } from '../ui/ThemeToggle'
import { HomeIcon, PlusIcon, PersonIcon } from '../ui/icons'

const NAV_ITEMS = [
  { path: '/', label: 'Início', Icon: HomeIcon },
  { path: '/events/new', label: 'Criar', Icon: PlusIcon },
  { path: '/profile', label: 'Perfil', Icon: PersonIcon },
]

type Props = {
  isDark: boolean
  onToggleTheme: () => void
}

export function BottomNav({ isDark, onToggleTheme }: Props) {
  const { theme: T } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/')
      return (
        location.pathname === '/' ||
        (location.pathname.startsWith('/events/') && location.pathname !== '/events/new')
      )
    return location.pathname.startsWith(path)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 62,
        background: T.bg,
        borderTop: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 200,
        paddingBottom: 4,
        transition: 'background 0.25s, border-color 0.25s',
      }}
    >
      {NAV_ITEMS.map(({ path, label, Icon }) => {
        const active = isActive(path)
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '6px 20px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: active ? T.accent : T.text3,
              fontFamily: 'DM Sans, sans-serif',
              transition: 'color 0.15s',
            }}
          >
            <Icon />
            <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
          </button>
        )
      })}
      <ThemeToggle isDark={isDark} onToggle={onToggleTheme} compact />
    </div>
  )
}

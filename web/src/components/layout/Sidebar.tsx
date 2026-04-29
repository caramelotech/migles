import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Logo } from '../ui/Logo'
import { SectionLabel } from '../ui/SectionLabel'
import { ThemeToggle } from '../ui/ThemeToggle'
import { HomeIcon, PlusIcon, PersonIcon } from '../ui/icons'
import { COMMUNITIES } from '../../data/mock'

const NAV_ITEMS = [
  { path: '/',           label: 'Início', Icon: HomeIcon  },
  { path: '/events/new', label: 'Criar',  Icon: PlusIcon  },
  { path: '/profile',    label: 'Perfil', Icon: PersonIcon },
]

type Props = {
  isDark: boolean
  onToggleTheme: () => void
}

export function Sidebar({ isDark, onToggleTheme }: Props) {
  const { theme: T } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || (location.pathname.startsWith('/events/') && location.pathname !== '/events/new')
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      style={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${T.border}`,
        padding: '22px 14px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: T.bg,
        transition: 'background 0.25s, border-color 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28, paddingLeft: 6 }}>
        <Logo size={28} />
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: T.text }}>migles</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const active = isActive(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                background: active ? T.accentDim : 'transparent',
                color: active ? T.accent : T.text2,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                width: '100%',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <Icon />
              {label}
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto', borderTop: `1px solid ${T.border}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <SectionLabel>Comunidades</SectionLabel>
          {COMMUNITIES.map(c => (
            <div
              key={c.id}
              onClick={() => navigate(`/communities/${c.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.text3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.name}
              </span>
            </div>
          ))}
        </div>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </nav>
  )
}

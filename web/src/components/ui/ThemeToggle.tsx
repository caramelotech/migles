import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

type Props = {
  isDark: boolean
  onToggle: () => void
  compact?: boolean
}

export function ThemeToggle({ isDark, onToggle, compact }: Props) {
  const { theme: T } = useTheme()
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 0 : 8,
        padding: compact ? '7px' : '8px 12px',
        borderRadius: 10,
        border: `1.5px solid ${T.border}`,
        background: hov ? T.s2 : 'transparent',
        color: T.text2,
        cursor: 'pointer',
        fontFamily: 'DM Sans',
        fontSize: 13,
        fontWeight: 500,
        transition: 'all 0.2s',
        width: compact ? 34 : '100%',
        justifyContent: compact ? 'center' : 'flex-start',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 15,
          lineHeight: 1,
          display: 'block',
          transition: 'transform 0.35s',
          transform: hov ? 'rotate(20deg)' : 'rotate(0deg)',
        }}
      >
        {isDark ? '☀️' : '🌙'}
      </span>
      {!compact && <span>{isDark ? 'Tema claro' : 'Tema escuro'}</span>}
    </button>
  )
}

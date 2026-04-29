import { useTheme } from '../../context/ThemeContext'

type Props = {
  initials: string
  color?: string
  size?: number
}

export function Avatar({ initials, color, size = 36 }: Props) {
  const { theme } = useTheme()
  const c = color ?? theme.accent
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: c + '20',
        border: `1.5px solid ${c}38`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.33,
        fontWeight: 600,
        color: c,
        flexShrink: 0,
        letterSpacing: '0.02em',
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  )
}

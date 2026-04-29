import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useTheme } from '../../context/ThemeContext'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  children: ReactNode
  variant?: Variant
  sz?: Size
  onClick?: () => void
  disabled?: boolean
  full?: boolean
  style?: CSSProperties
  type?: 'button' | 'submit'
}

export function Button({
  children,
  variant = 'primary',
  sz = 'md',
  onClick,
  disabled,
  full,
  style: extra,
  type = 'button',
}: Props) {
  const { theme: T } = useTheme()
  const [hov, setHov] = useState(false)

  const variants: Record<Variant, CSSProperties> = {
    primary: { background: T.accent, color: '#fff', border: 'none' },
    secondary: {
      background: T.accentDim,
      color: T.accentLight,
      border: `1.5px solid rgba(155,135,245,0.25)`,
    },
    ghost: { background: 'transparent', color: T.text2, border: `1.5px solid ${T.border}` },
    danger: { background: T.redDim, color: T.red, border: `1.5px solid rgba(248,113,113,0.2)` },
    success: { background: T.greenDim, color: T.green, border: `1.5px solid rgba(74,222,128,0.2)` },
  }

  const sizes: Record<Size, CSSProperties> = {
    sm: { padding: '5px 12px', fontSize: 12, borderRadius: 8, height: 30 },
    md: { padding: '9px 16px', fontSize: 14, borderRadius: 10, height: 38 },
    lg: { padding: '12px 22px', fontSize: 15, borderRadius: 11, height: 44 },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...variants[variant],
        ...sizes[sz],
        ...extra,
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : hov ? 0.85 : 1,
        width: full ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transform: hov && !disabled ? 'translateY(-1px)' : 'none',
      }}
    >
      {children}
    </button>
  )
}

import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useTheme } from '../../context/ThemeContext'

type Props = {
  children: ReactNode
  style?: CSSProperties
  onClick?: () => void
}

export function Card({ children, style: extra, onClick }: Props) {
  const { theme: T } = useTheme()
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && onClick ? T.s2 : T.s1,
        border: `1px solid ${hov && onClick ? T.borderH : T.border}`,
        borderRadius: 14,
        padding: 18,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'all 0.15s',
        transform: hov && onClick ? 'translateY(-1px)' : 'none',
        ...extra,
      }}
    >
      {children}
    </div>
  )
}

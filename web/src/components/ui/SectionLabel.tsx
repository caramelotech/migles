import type { ReactNode } from 'react'
import { useTheme } from '../../context/ThemeContext'

export function SectionLabel({ children }: { children: ReactNode }) {
  const { theme: T } = useTheme()
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: T.text3,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  )
}

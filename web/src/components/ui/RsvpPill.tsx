import { useTheme } from '../../context/ThemeContext'
import type { RsvpStatus } from '../../types'

export function RsvpPill({ status }: { status: RsvpStatus }) {
  const { theme: T } = useTheme()

  const map: Record<RsvpStatus, [string, string, string]> = {
    confirmed:  [T.green,  T.greenDim,  'Confirmado'],
    declined:   [T.red,    T.redDim,    'Recusado'],
    pending:    [T.amber,  T.amberDim,  'Pendente'],
    waitlisted: [T.accent, T.accentDim, 'Na fila'],
  }

  const [color, bg, label] = map[status]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 9px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        color,
        background: bg,
        flexShrink: 0,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}

import { useTheme } from '../../context/ThemeContext'

type Props = {
  dateLabel: string
  color?: string
}

export function DateChip({ dateLabel }: Props) {
  const { theme: T } = useTheme()
  const c = T.accent
  const parts = dateLabel.split(' ')
  const weekday = parts[0].replace(',', '')
  const day = parts[1]
  const month = parts[2]

  return (
    <div
      style={{
        background: c + '14',
        border: `1px solid ${c}28`,
        borderRadius: 10,
        padding: '8px 10px',
        textAlign: 'center',
        minWidth: 52,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: c,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {month}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: c,
          lineHeight: 1.1,
          fontFamily: 'DM Serif Display, serif',
        }}
      >
        {day}
      </div>
      <div style={{ fontSize: 10, color: c + '99' }}>{weekday}</div>
    </div>
  )
}

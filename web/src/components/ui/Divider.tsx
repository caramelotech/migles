import { useTheme } from '../../context/ThemeContext'

export function Divider() {
  const { theme: T } = useTheme()
  return <div style={{ height: 1, background: T.border, margin: '20px 0' }} />
}

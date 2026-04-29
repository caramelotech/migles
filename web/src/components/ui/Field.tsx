import { useTheme } from '../../context/ThemeContext'

type Props = {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  textarea?: boolean
  required?: boolean
  error?: string
  hint?: string
  min?: string
  max?: string
  rows?: number
  disabled?: boolean
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea,
  required,
  error,
  hint,
  min,
  max,
  rows = 3,
  disabled,
}: Props) {
  const { theme: T } = useTheme()

  const inputStyle = {
    background: disabled ? T.s3 : T.s2,
    border: `1.5px solid ${error ? 'rgba(248,113,113,0.45)' : T.border}`,
    borderRadius: 10,
    color: disabled ? T.text3 : T.text,
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14,
    padding: '10px 14px',
    width: '100%',
    transition: 'border-color 0.15s',
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : undefined,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: T.red }}> *</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          value={value}
          onChange={e => !disabled && onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          style={inputStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => !disabled && onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          style={inputStyle}
        />
      )}
      {(error || hint) && (
        <span style={{ fontSize: 12, color: error ? T.red : T.text3 }}>{error || hint}</span>
      )}
    </div>
  )
}

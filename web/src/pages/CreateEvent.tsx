import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { COMMUNITIES } from '../data/mock'

type LocationType = 'physical' | 'online'
type Visibility = 'private' | 'community'

type FormState = {
  title: string
  description: string
  date: string
  time: string
  locationType: LocationType
  location: string
  capacity: string
  visibility: Visibility
  community: string
  cover: string | null
}

type Errors = Partial<Record<keyof FormState, string>>

function CoverPhotoZone({
  cover,
  onChange,
}: {
  cover: string | null
  onChange: (v: string) => void
}) {
  const { theme: T } = useTheme()
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    onChange(URL.createObjectURL(file))
  }

  return (
    <div
      onDragOver={e => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault()
        setDrag(false)
        const f = e.dataTransfer.files[0]
        if (f) handleFile(f)
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        height: 160,
        borderRadius: 14,
        cursor: 'pointer',
        overflow: 'hidden',
        border: `2px dashed ${drag ? T.accent : T.border}`,
        background: cover ? 'none' : T.s2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
      {cover ? (
        <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: T.s3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            📷
          </div>
          <span style={{ fontSize: 13, color: T.text3, fontWeight: 500 }}>
            Adicionar foto de capa
          </span>
          <span style={{ fontSize: 11, color: T.text3 }}>Clique ou arraste uma imagem</span>
        </>
      )}
    </div>
  )
}

function SegToggle<V extends string>({
  value,
  onChange,
  options,
}: {
  value: V
  onChange: (v: V) => void
  options: [V, string, string][]
}) {
  const { theme } = useTheme()
  return (
    <div style={{ display: 'flex', background: theme.s2, borderRadius: 10, padding: 3, gap: 2 }}>
      {options.map(([val, label, icon]) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'DM Sans',
            fontSize: 13,
            fontWeight: value === val ? 500 : 400,
            background: value === val ? theme.s1 : 'transparent',
            color: value === val ? theme.accent : theme.text2,
            boxShadow: value === val ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <span style={{ fontSize: 14 }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  )
}

const FIELD_LABEL: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: 6,
}

export function CreateEvent() {
  const { theme: T } = useTheme()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    date: '',
    time: '',
    locationType: 'physical',
    location: '',
    capacity: '',
    visibility: 'private',
    community: '',
    cover: null,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!done) return
    const id = setTimeout(() => navigate('/'), 1800)
    return () => clearTimeout(id)
  }, [done, navigate])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: T.s2,
    border: `1.5px solid ${T.border}`,
    borderRadius: 14,
    color: T.text,
    fontFamily: 'DM Sans',
    fontSize: 15,
    padding: '13px 16px',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  function validate() {
    const e: Errors = {}
    if (!form.title.trim()) e.title = 'Título é obrigatório'
    if (!form.date) e.date = 'Escolha uma data'
    if (!form.time) e.time = 'Escolha um horário'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    setDone(true)
  }

  if (done)
    return (
      <div
        className="scale-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: T.greenDim,
            border: `2px solid rgba(74,222,128,0.3)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            color: T.green,
          }}
        >
          ✓
        </div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: T.text }}>
          Evento criado!
        </div>
        <div style={{ color: T.text2, fontSize: 14 }}>Redirecionando para o início…</div>
      </div>
    )

  return (
    <div
      className="fade-up"
      style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px 100px' }}
    >
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 26,
            marginBottom: 2,
            color: T.text,
          }}
        >
          Criar evento
        </div>
        <div style={{ color: T.text3, fontSize: 13 }}>Preencha os detalhes do seu encontro</div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <CoverPhotoZone cover={form.cover} onChange={v => set('cover', v)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Title */}
        <div>
          <div style={{ ...FIELD_LABEL, color: T.text3 }}>
            Nome do evento <span style={{ color: T.red }}>*</span>
          </div>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="O que vamos fazer?"
            style={{
              ...inputStyle,
              ...(errors.title ? { borderColor: 'rgba(248,113,113,0.5)' } : {}),
            }}
          />
          {errors.title && (
            <div style={{ fontSize: 12, color: T.red, marginTop: 4 }}>{errors.title}</div>
          )}
        </div>

        {/* Description */}
        <div>
          <div style={{ ...FIELD_LABEL, color: T.text3 }}>Descrição</div>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Conta um pouco sobre o evento…"
            rows={4}
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        {/* Date + Time */}
        <div>
          <div style={{ ...FIELD_LABEL, color: T.text3 }}>
            Data e horário <span style={{ color: T.red }}>*</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              style={{
                ...inputStyle,
                ...(errors.date ? { borderColor: 'rgba(248,113,113,0.5)' } : {}),
              }}
            />
            <input
              type="time"
              value={form.time}
              onChange={e => set('time', e.target.value)}
              style={{
                ...inputStyle,
                ...(errors.time ? { borderColor: 'rgba(248,113,113,0.5)' } : {}),
              }}
            />
          </div>
          {(errors.date || errors.time) && (
            <div style={{ fontSize: 12, color: T.red, marginTop: 4 }}>
              {errors.date || errors.time}
            </div>
          )}
        </div>

        {/* Location type */}
        <div>
          <div style={{ ...FIELD_LABEL, color: T.text3 }}>Tipo de local</div>
          <SegToggle<LocationType>
            value={form.locationType}
            onChange={v => set('locationType', v)}
            options={[
              ['physical', 'Presencial', '🏠'],
              ['online', 'Online', '💻'],
            ]}
          />
          <div className="fade-in" style={{ marginTop: 10 }}>
            <input
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder={
                form.locationType === 'physical'
                  ? 'Endereço ou nome do local'
                  : 'Link do evento (Zoom, Meet…)'
              }
              style={inputStyle}
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 6,
            }}
          >
            <div style={{ ...FIELD_LABEL, color: T.text3, marginBottom: 0 }}>Limite de vagas</div>
            <span style={{ fontSize: 11, color: T.text3 }}>Opcional</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={form.capacity}
              onChange={e => set('capacity', e.target.value)}
              placeholder="Ilimitado"
              min="1"
              style={{ ...inputStyle, paddingRight: 80 }}
            />
            {!form.capacity && (
              <span
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 12,
                  color: T.text3,
                  pointerEvents: 'none',
                }}
              >
                vagas
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: T.text3, marginTop: 5 }}>
            Sem limite = qualquer pessoa pode entrar
          </div>
        </div>

        {/* Visibility */}
        <div>
          <div style={{ ...FIELD_LABEL, color: T.text3 }}>Visibilidade</div>
          <SegToggle<Visibility>
            value={form.visibility}
            onChange={v => set('visibility', v)}
            options={[
              ['private', 'Privado', '🔒'],
              ['community', 'Comunidade', '👥'],
            ]}
          />
        </div>

        {/* Community picker */}
        {form.visibility === 'community' && (
          <div className="fade-in">
            <div style={{ ...FIELD_LABEL, color: T.text3 }}>Selecionar comunidade</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {COMMUNITIES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => set('community', c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 14px',
                    borderRadius: 10,
                    background: form.community === c.id ? T.accentDim : T.s2,
                    border: `1.5px solid ${form.community === c.id ? T.accent + '50' : T.border}`,
                    color: form.community === c.id ? T.accent : T.text2,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans',
                    fontSize: 14,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: T.accent + '22',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: T.accent,
                      flexShrink: 0,
                    }}
                  >
                    {c.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 1 }}>
                      {c.members} membros
                    </div>
                  </div>
                  {form.community === c.id && (
                    <span style={{ fontSize: 14, color: T.accent }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          background: T.bg,
          borderTop: `1px solid ${T.border}`,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 100,
        }}
      >
        <button
          type="button"
          onClick={submit}
          style={{
            width: '100%',
            maxWidth: 560,
            height: 52,
            borderRadius: 14,
            background: T.accentDim,
            color: T.accent,
            border: `1.5px solid ${T.accent}40`,
            cursor: 'pointer',
            fontFamily: 'DM Sans',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            transition: 'opacity 0.15s',
          }}
        >
          Criar evento
        </button>
      </div>
    </div>
  )
}

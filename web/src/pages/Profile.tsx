import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useEvents } from '../context/EventsContext'
import { RsvpPill } from '../components/ui/RsvpPill'
import { ChevronRightIcon, SignOutIcon } from '../components/ui/icons'
import { ME, COMMUNITIES } from '../data/mock'

function SectionHeader({
  title,
  count,
  open,
  onToggle,
}: {
  title: string
  count?: number
  open: boolean
  onToggle: () => void
}) {
  const { theme: T } = useTheme()
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        background: T.s1,
        border: `1px solid ${T.border}`,
        borderRadius: open ? '14px 14px 0 0' : 14,
        padding: '15px 18px',
        cursor: 'pointer',
        fontFamily: 'DM Sans',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{title}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {count != null && (
          <span
            style={{
              fontSize: 12,
              color: T.accent,
              background: T.accentDim,
              padding: '2px 8px',
              borderRadius: 20,
              fontWeight: 500,
            }}
          >
            {count}
          </span>
        )}
        <span style={{ color: T.text3 }}>
          <ChevronRightIcon
            style={{
              transition: 'transform 0.2s',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </span>
      </div>
    </button>
  )
}

export function Profile() {
  const { theme: T } = useTheme()
  const navigate = useNavigate()
  const { events } = useEvents()

  const [commOpen, setCommOpen] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)
  const [eventFilter, setEventFilter] = useState<'proximos' | 'confirmados' | 'todos'>('proximos')

  const myEvents = events.filter(e => e.myRsvp !== 'declined')
  const confirmed = events.filter(e => e.myRsvp === 'confirmed')
  const pending = events.filter(e => e.myRsvp === 'pending')

  const filteredEvents =
    eventFilter === 'confirmados' ? confirmed : eventFilter === 'proximos' ? pending : myEvents

  const filterTabs: { key: typeof eventFilter; label: string }[] = [
    { key: 'proximos', label: 'Aguardando' },
    { key: 'confirmados', label: 'Confirmados' },
    { key: 'todos', label: 'Todos' },
  ]

  return (
    <div className="fade-up" style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 20 }}>Perfil</div>

      {/* User card */}
      <div
        style={{
          background: T.s1,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: T.s3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke={T.text3}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{ME.name}</div>
              <div style={{ fontSize: 13, color: T.text3 }}>lucas.ferreira@email.com</div>
            </div>
          </div>
          <button
            style={{
              padding: '6px 14px',
              borderRadius: 14,
              border: `1.5px solid ${T.accent}40`,
              background: T.accentDim,
              color: T.accent,
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              fontSize: 13,
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            Editar perfil
          </button>
        </div>

        {ME.bio && (
          <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, marginBottom: 16 }}>
            {ME.bio}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            paddingTop: 16,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          {(
            [
              [ME.eventsCount, 'Eventos'],
              [COMMUNITIES.length, 'Comunidades'],
              [7, 'Criados'],
            ] as [number, string][]
          ).map(([n, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: T.accent, lineHeight: 1 }}>
                {n}
              </div>
              <div style={{ fontSize: 12, color: T.text2, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Communities expandable */}
      <div style={{ marginBottom: 8 }}>
        <SectionHeader
          title="Minhas Comunidades"
          count={COMMUNITIES.length}
          open={commOpen}
          onToggle={() => setCommOpen(v => !v)}
        />
        {commOpen && (
          <div
            className="fade-in"
            style={{
              background: T.s1,
              border: `1px solid ${T.border}`,
              borderTop: 'none',
              borderRadius: '0 0 14px 14px',
              overflow: 'hidden',
            }}
          >
            {COMMUNITIES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => navigate(`/communities/${c.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 18px',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderTop: i > 0 ? `1px solid ${T.border}` : 'none',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans',
                  textAlign: 'left',
                  transition: 'background 0.12s',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: T.accentDim,
                    border: `1.5px solid ${T.accent}28`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: T.accent,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {c.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: T.text3 }}>
                    {c.members} membros · {c.type === 'public' ? 'Pública' : 'Privada'}
                  </div>
                </div>
                <ChevronRightIcon style={{ color: T.text3 }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Events expandable */}
      <div style={{ marginBottom: 12 }}>
        <SectionHeader
          title="Meus Eventos"
          count={myEvents.length}
          open={eventsOpen}
          onToggle={() => setEventsOpen(v => !v)}
        />
        {eventsOpen && (
          <div
            className="fade-in"
            style={{
              background: T.s1,
              border: `1px solid ${T.border}`,
              borderTop: 'none',
              borderRadius: '0 0 14px 14px',
              overflow: 'hidden',
            }}
          >
            {/* Filter tabs */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                padding: '12px 16px',
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setEventFilter(tab.key)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 20,
                    border: eventFilter === tab.key ? 'none' : `1px solid ${T.border}`,
                    background: eventFilter === tab.key ? T.accentDim : 'transparent',
                    color: eventFilter === tab.key ? T.accent : T.text2,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans',
                    fontSize: 13,
                    fontWeight: eventFilter === tab.key ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {filteredEvents.length === 0 ? (
              <div
                style={{ padding: '24px 18px', textAlign: 'center', fontSize: 13, color: T.text3 }}
              >
                Nenhum evento nessa categoria.
              </div>
            ) : (
              filteredEvents.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => navigate(`/events/${e.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 18px',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderTop: i > 0 ? `1px solid ${T.border}` : 'none',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans',
                    textAlign: 'left',
                    transition: 'background 0.12s',
                  }}
                >
                  <div
                    style={{
                      minWidth: 42,
                      height: 42,
                      borderRadius: 10,
                      background: T.accentDim,
                      border: `1px solid ${T.accent}28`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: T.accent,
                        fontWeight: 700,
                        lineHeight: 1,
                        textTransform: 'uppercase',
                      }}
                    >
                      {e.dateLabel.split(', ')[0]}
                    </span>
                    <span
                      style={{ fontSize: 14, color: T.accent, fontWeight: 700, lineHeight: 1.2 }}
                    >
                      {e.dateLabel.split(' ')[1]}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: T.text,
                        marginBottom: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {e.title}
                    </div>
                    <div style={{ fontSize: 12, color: T.text3 }}>
                      {e.time} · {e.community.name}
                    </div>
                  </div>
                  <RsvpPill status={e.myRsvp} />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Sign out */}
      <button
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: 14,
          border: 'none',
          background: T.red,
          color: '#fff',
          cursor: 'pointer',
          fontFamily: 'DM Sans',
          fontSize: 15,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 28,
        }}
      >
        <SignOutIcon />
        Sair
      </button>
    </div>
  )
}

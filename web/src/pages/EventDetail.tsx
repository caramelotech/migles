import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useEvents } from '../context/EventsContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { RsvpPill } from '../components/ui/RsvpPill'
import { CommentThread } from '../components/features/CommentThread'
import { ArrowLeftIcon, LinkIcon } from '../components/ui/icons'
import { ME } from '../data/mock'
import type { RsvpStatus } from '../types'

export function EventDetail() {
  const { theme: T } = useTheme()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { events, updateRsvp, addComment } = useEvents()
  const [newComment, setNewComment] = useState('')
  const [attendeesExpanded, setAttendeesExpanded] = useState(false)

  const event = events.find(e => e.id === id)
  if (!event)
    return (
      <div style={{ padding: 32, color: T.text2, textAlign: 'center' }}>
        Evento não encontrado.
        <br />
        <br />
        <Button variant="ghost" onClick={() => navigate('/')}>
          ← Voltar
        </Button>
      </div>
    )

  const isFull = event.capacity != null && event.rsvpCount >= event.capacity
  const pct = event.capacity ? Math.min(100, (event.rsvpCount / event.capacity) * 100) : 0
  const barColor = pct >= 95 ? T.red : T.accent

  const infoLabel: React.CSSProperties = {
    fontSize: 11,
    color: T.text3,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  }

  function rsvp(s: RsvpStatus) {
    updateRsvp(event.id, s)
  }

  function submitComment() {
    if (!newComment.trim()) return
    addComment(event.id, newComment.trim(), null)
    setNewComment('')
  }

  return (
    <div className="fade-up" style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px' }}>
      {/* Back row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: T.text2,
            cursor: 'pointer',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'DM Sans',
            padding: 0,
          }}
        >
          <ArrowLeftIcon /> Voltar
        </button>
        <Button variant="ghost" sz="sm" onClick={() => navigate(`/events/${event.id}/preview`)}>
          <LinkIcon /> Preview público
        </Button>
      </div>

      {/* Cover image */}
      {event.coverImage && (
        <div style={{ height: 220, borderRadius: 14, overflow: 'hidden', marginBottom: 22 }}>
          <img
            src={event.coverImage}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Hero */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span
            style={{
              fontSize: 12,
              color: T.accent,
              background: T.accentDim,
              padding: '3px 9px',
              borderRadius: 20,
              fontWeight: 500,
            }}
          >
            {event.community.name}
          </span>
          <span style={{ fontSize: 12, color: T.text3 }}>·</span>
          <span style={{ fontSize: 12, color: T.text3 }}>
            {event.dateLabel} às {event.time}
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 32,
            lineHeight: 1.2,
            marginBottom: 14,
            color: T.text,
          }}
        >
          {event.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar initials={event.organizer.initials} color={event.organizer.color} size={26} />
          <span style={{ fontSize: 13, color: T.text2 }}>
            por <span style={{ color: T.text }}>{event.organizer.name}</span>
          </span>
        </div>
      </div>

      {/* Info grid */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ ...infoLabel, marginBottom: 5 }}>
              Data e hora
            </div>
            <div style={{ fontSize: 14, color: T.text }}>
              {event.dateLabel} · {event.time}
            </div>
          </div>
          <div>
            <div style={{ ...infoLabel, marginBottom: 5 }}>
              Local
            </div>
            <div style={{ fontSize: 14, color: T.text }}>{event.location}</div>
          </div>
          {event.capacity != null && (
            <>
              <div>
                <div style={{ ...infoLabel, marginBottom: 5 }}>
                  Vagas
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: T.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {event.rsvpCount}/{event.capacity}
                  {event.waitlistCount > 0 && (
                    <span
                      style={{
                        fontSize: 12,
                        color: T.accent,
                        background: T.accentDim,
                        padding: '1px 7px',
                        borderRadius: 20,
                      }}
                    >
                      +{event.waitlistCount} na fila
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div style={{ ...infoLabel, marginBottom: 8 }}>
                  Ocupação
                </div>
                <div style={{ height: 6, background: T.s3, borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 3,
                      background: barColor,
                      width: `${pct}%`,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
                  {Math.round(pct)}% ocupado
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* RSVP */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 12 }}>
          Sua resposta
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant={event.myRsvp === 'confirmed' ? 'success' : 'ghost'}
            onClick={() => rsvp(event.myRsvp === 'confirmed' ? 'pending' : 'confirmed')}
          >
            {event.myRsvp === 'confirmed' ? '✓ Confirmado' : 'Confirmar presença'}
          </Button>
          <Button
            variant={event.myRsvp === 'declined' ? 'danger' : 'ghost'}
            onClick={() => rsvp(event.myRsvp === 'declined' ? 'pending' : 'declined')}
          >
            {event.myRsvp === 'declined' ? '✕ Recusado' : 'Recusar'}
          </Button>
          {isFull && event.myRsvp === 'pending' && (
            <span
              style={{
                fontSize: 12,
                color: T.accent,
                background: T.accentDim,
                padding: '5px 11px',
                borderRadius: 8,
              }}
            >
              Entrar na lista de espera →
            </span>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <RsvpPill status={event.myRsvp} />
          </div>
        </div>
      </Card>

      {/* Attendees */}
      <Card style={{ marginBottom: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>
            Confirmados ({event.rsvpCount})
          </div>
          <button
            onClick={() => setAttendeesExpanded(e => !e)}
            style={{
              background: 'none',
              border: `1px solid ${T.border}`,
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: 12,
              color: T.accent,
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.15s',
            }}
          >
            {attendeesExpanded ? 'Recolher ↑' : 'Ver todos ↓'}
          </button>
        </div>

        {!attendeesExpanded && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {event.attendees.map(a => (
              <div
                key={a.initials}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: T.s2,
                  padding: '4px 10px 4px 4px',
                  borderRadius: 20,
                  border: `1px solid ${T.border}`,
                }}
              >
                <Avatar initials={a.initials} size={22} />
                <span style={{ fontSize: 12, color: T.text }}>{a.initials}</span>
              </div>
            ))}
            {event.rsvpCount > event.attendees.length && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 12,
                  color: T.text3,
                  background: T.s2,
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: `1px solid ${T.border}`,
                }}
              >
                +{event.rsvpCount - event.attendees.length} mais
              </div>
            )}
          </div>
        )}

        {attendeesExpanded && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {event.attendees.map((a, i) => (
              <div
                key={a.initials}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 8px',
                  borderRadius: 10,
                  background: i % 2 === 0 ? 'transparent' : T.s2 + '60',
                }}
              >
                <Avatar initials={a.initials} size={34} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>
                    {a.name || a.initials}
                  </div>
                  {a.initials === ME.initials && (
                    <div style={{ fontSize: 11, color: T.accent }}>Você</div>
                  )}
                </div>
                {a.initials === event.organizer.initials && (
                  <span
                    style={{
                      fontSize: 11,
                      color: T.text3,
                      background: T.s3,
                      padding: '2px 8px',
                      borderRadius: 20,
                    }}
                  >
                    Organizador
                  </span>
                )}
              </div>
            ))}
            {event.rsvpCount > event.attendees.length && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '8px 0',
                  fontSize: 13,
                  color: T.text3,
                  borderTop: `1px solid ${T.border}`,
                  marginTop: 4,
                }}
              >
                +{event.rsvpCount - event.attendees.length} confirmados não exibidos
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Description */}
      {event.description && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 8 }}>
            Sobre
          </div>
          <div style={{ fontSize: 14, color: T.text, lineHeight: 1.75 }}>{event.description}</div>
        </Card>
      )}

      {/* Comments */}
      <Card>
        <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 18 }}>
          Comentários ({event.comments.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 20 }}>
          {event.comments.length === 0 && (
            <div style={{ fontSize: 14, color: T.text3, textAlign: 'center', padding: '10px 0' }}>
              Nenhum comentário ainda. Seja o primeiro!
            </div>
          )}
          {event.comments.map(c => (
            <CommentThread
              key={c.id}
              comment={c}
              onReply={(cid, txt) => addComment(event.id, txt, cid)}
            />
          ))}
        </div>
        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            paddingTop: 16,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <Avatar initials={ME.initials} color={ME.color} size={32} />
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Adicionar comentário…"
            onKeyDown={e => e.key === 'Enter' && submitComment()}
            style={{
              flex: 1,
              background: T.s2,
              border: `1.5px solid ${T.border}`,
              borderRadius: 14,
              color: T.text,
              fontFamily: 'DM Sans',
              fontSize: 14,
              padding: '9px 14px',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
          />
          <Button onClick={submitComment} disabled={!newComment.trim()}>
            Enviar
          </Button>
        </div>
      </Card>
    </div>
  )
}

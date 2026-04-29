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

  const event = events.find(e => e.id === id)
  if (!event) return (
    <div style={{ padding: 32, color: T.text2, textAlign: 'center' }}>
      Evento não encontrado.
      <br /><br />
      <Button variant="ghost" onClick={() => navigate('/')}>← Voltar</Button>
    </div>
  )

  const ev = event
  const cc = ev.community.color
  const isFull = ev.capacity != null && ev.rsvpCount >= ev.capacity
  const pct = ev.capacity ? Math.min(100, (ev.rsvpCount / ev.capacity) * 100) : 0
  const barColor = pct >= 90 ? T.red : pct >= 70 ? T.amber : cc

  function rsvp(s: RsvpStatus) { updateRsvp(ev.id, s) }

  function submitComment() {
    if (!newComment.trim()) return
    addComment(ev.id, newComment.trim(), null)
    setNewComment('')
  }

  return (
    <div className="fade-up" style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
      {/* Back row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: T.text2, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans', padding: 0 }}
        >
          <ArrowLeftIcon /> Voltar
        </button>
        <Button variant="ghost" sz="sm" onClick={() => navigate(`/events/${ev.id}/preview`)}>
          <LinkIcon /> Preview público
        </Button>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: cc, background: cc + '14', padding: '3px 9px', borderRadius: 20, fontWeight: 500 }}>
            {ev.community.name}
          </span>
          <span style={{ fontSize: 12, color: T.text3 }}>·</span>
          <span style={{ fontSize: 12, color: T.text3 }}>{ev.dateLabel} às {ev.time}</span>
        </div>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, lineHeight: 1.2, marginBottom: 14, color: T.text }}>
          {ev.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar initials={ev.organizer.initials} color={ev.organizer.color} size={26} />
          <span style={{ fontSize: 13, color: T.text2 }}>
            por <span style={{ color: T.text }}>{ev.organizer.name}</span>
          </span>
        </div>
      </div>

      {/* Info grid */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Data e hora</div>
            <div style={{ fontSize: 14, color: T.text }}>{ev.dateLabel} · {ev.time}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Local</div>
            <div style={{ fontSize: 14, color: T.text }}>{ev.location}</div>
          </div>
          {ev.capacity != null && (
            <>
              <div>
                <div style={{ fontSize: 11, color: T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Vagas</div>
                <div style={{ fontSize: 14, color: T.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {ev.rsvpCount}/{ev.capacity}
                  {ev.waitlistCount > 0 && (
                    <span style={{ fontSize: 12, color: T.accent, background: T.accentDim, padding: '1px 7px', borderRadius: 20 }}>
                      +{ev.waitlistCount} na fila
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Ocupação</div>
                <div style={{ height: 6, background: T.s3, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: barColor, width: `${pct}%`, transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>{Math.round(pct)}% ocupado</div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* RSVP */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 12 }}>Sua resposta</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant={ev.myRsvp === 'confirmed' ? 'success' : 'ghost'}
            onClick={() => rsvp(ev.myRsvp === 'confirmed' ? 'pending' : 'confirmed')}
          >
            {ev.myRsvp === 'confirmed' ? '✓ Confirmado' : 'Confirmar presença'}
          </Button>
          <Button
            variant={ev.myRsvp === 'declined' ? 'danger' : 'ghost'}
            onClick={() => rsvp(ev.myRsvp === 'declined' ? 'pending' : 'declined')}
          >
            {ev.myRsvp === 'declined' ? '✕ Recusado' : 'Recusar'}
          </Button>
          {isFull && ev.myRsvp === 'pending' && (
            <span style={{ fontSize: 12, color: T.accent, background: T.accentDim, padding: '5px 11px', borderRadius: 8 }}>
              Entrar na lista de espera →
            </span>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <RsvpPill status={ev.myRsvp} />
          </div>
        </div>
      </Card>

      {/* Attendees */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 12 }}>
          Confirmados ({ev.rsvpCount})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ev.attendees.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.s2, padding: '4px 10px 4px 4px', borderRadius: 20, border: `1px solid ${T.border}` }}>
              <Avatar initials={a.initials} color={a.color} size={22} />
              <span style={{ fontSize: 12, color: T.text }}>{a.initials}</span>
            </div>
          ))}
          {ev.rsvpCount > ev.attendees.length && (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: T.text3, background: T.s2, padding: '4px 10px', borderRadius: 20, border: `1px solid ${T.border}` }}>
              +{ev.rsvpCount - ev.attendees.length}
            </div>
          )}
        </div>
      </Card>

      {/* Description */}
      {ev.description && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 8 }}>Sobre</div>
          <div style={{ fontSize: 14, color: T.text, lineHeight: 1.75 }}>{ev.description}</div>
        </Card>
      )}

      {/* Comments */}
      <Card>
        <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 18 }}>
          Comentários ({ev.comments.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 20 }}>
          {ev.comments.length === 0 && (
            <div style={{ fontSize: 14, color: T.text3, textAlign: 'center', padding: '10px 0' }}>
              Nenhum comentário ainda. Seja o primeiro!
            </div>
          )}
          {ev.comments.map(c => (
            <CommentThread
              key={c.id}
              comment={c}
              onReply={(cid, txt) => addComment(ev.id, txt, cid)}
            />
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
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
              borderRadius: 10,
              color: T.text,
              fontFamily: 'DM Sans',
              fontSize: 14,
              padding: '9px 14px',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
          />
          <Button onClick={submitComment} disabled={!newComment.trim()}>Enviar</Button>
        </div>
      </Card>
    </div>
  )
}

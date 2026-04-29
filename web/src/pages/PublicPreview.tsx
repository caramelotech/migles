import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useEvents } from '../context/EventsContext'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Card } from '../components/ui/Card'

export function PublicPreview() {
  const { theme: T } = useTheme()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { events } = useEvents()
  const [rsvpClicked, setRsvpClicked] = useState(false)

  const event = events.find(e => e.id === id)
  if (!event) return (
    <div style={{ padding: 32, color: T.text2, textAlign: 'center' }}>
      Evento não encontrado.
    </div>
  )

  const cc = event.community.color

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.s1, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size={24} />
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: T.text }}>migles</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" sz="sm" onClick={() => navigate('/')}>Entrar</Button>
          <Button sz="sm" onClick={() => navigate('/')}>Criar conta</Button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 680, padding: '40px 24px' }}>
          {/* Community badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: cc + '20', border: `1.5px solid ${cc}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: cc, fontWeight: 700 }}>
              {event.community.name[0]}
            </div>
            <span style={{ fontSize: 13, color: T.text2 }}>{event.community.name}</span>
            <span style={{ fontSize: 12, color: T.text3 }}>·</span>
            <span style={{ fontSize: 12, color: T.text3 }}>Evento público</span>
          </div>

          {/* Hero title */}
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, lineHeight: 1.15, marginBottom: 16, color: T.text }}>
            {event.title}
          </h1>

          {/* Info chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
            {[['📅', `${event.dateLabel} às ${event.time}`], ['📍', event.location]].map(([icon, text], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, background: T.s2, border: `1px solid ${T.border}`, borderRadius: 20, padding: '6px 14px', fontSize: 13, color: T.text2 }}>
                <span style={{ fontSize: 15 }}>{icon}</span> {text}
              </div>
            ))}
          </div>

          {/* RSVP CTA */}
          <div style={{ background: `linear-gradient(135deg, ${cc}18 0%, ${T.accentDim} 100%)`, border: `1px solid ${cc}28`, borderRadius: 16, padding: 24, marginBottom: 28 }}>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, marginBottom: 6, color: T.text }}>
              {rsvpClicked ? 'Faça login para confirmar' : 'Quer participar?'}
            </div>
            <div style={{ fontSize: 13, color: T.text2, marginBottom: 16 }}>
              {rsvpClicked
                ? 'Você precisa de uma conta Migles para confirmar presença.'
                : `${event.rsvpCount} pessoas já confirmaram.${event.capacity != null ? ` Restam ${event.capacity - event.rsvpCount} vagas.` : ''}`}
            </div>
            {!rsvpClicked ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button sz="lg" onClick={() => setRsvpClicked(true)}>Confirmar presença</Button>
                <Button variant="ghost" sz="lg" onClick={() => navigate('/')}>Já tenho conta</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button sz="lg" onClick={() => navigate('/')}>Criar conta grátis</Button>
                <Button variant="ghost" sz="lg" onClick={() => navigate('/')}>Fazer login</Button>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: T.text3, marginBottom: 12 }}>Sobre o evento</div>
            <p style={{ fontSize: 15, color: T.text2, lineHeight: 1.8 }}>{event.description}</p>
          </div>

          {/* Organizer */}
          <Card style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar initials={event.organizer.initials} color={event.organizer.color} size={44} />
            <div>
              <div style={{ fontSize: 11, color: T.text3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Organizado por</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{event.organizer.name}</div>
            </div>
          </Card>

          {/* Attendees (blurred) */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: T.text3, marginBottom: 12 }}>
              Confirmados ({event.rsvpCount})
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}>
                {[...event.attendees, ...event.attendees].slice(0, 8).map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.s2, padding: '6px 12px 6px 6px', borderRadius: 20, border: `1px solid ${T.border}` }}>
                    <Avatar initials={a.initials} color={a.color} size={26} />
                    <span style={{ fontSize: 12, color: T.text }}>••••••</span>
                  </div>
                ))}
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate('/')}
                  style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 10, padding: '8px 16px', fontSize: 13, color: T.text, cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                >
                  Entrar para ver quem vai
                </button>
              </div>
            </div>
          </div>

          {/* App CTA */}
          <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <Logo size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 3, fontSize: 15, color: T.text }}>Baixe o Migles</div>
              <div style={{ fontSize: 13, color: T.text2 }}>Organize seus encontros. Disponível para iOS e Android.</div>
            </div>
            <Button variant="secondary" sz="sm">Em breve</Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center' }}>
        <Logo size={14} />
        <span style={{ fontSize: 12, color: T.text3 }}>migles · 2026</span>
      </div>
    </div>
  )
}

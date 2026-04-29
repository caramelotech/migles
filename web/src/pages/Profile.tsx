import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useEvents } from '../context/EventsContext'
import { Card } from '../components/ui/Card'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { DateChip } from '../components/ui/DateChip'
import { RsvpPill } from '../components/ui/RsvpPill'
import { SectionLabel } from '../components/ui/SectionLabel'
import { ME, COMMUNITIES } from '../data/mock'

export function Profile() {
  const { theme: T } = useTheme()
  const navigate = useNavigate()
  const { events } = useEvents()
  const myEvents = events.filter(e => e.myRsvp !== 'declined')

  return (
    <div className="fade-up" style={{ maxWidth: 620, margin: '0 auto', padding: '32px 24px' }}>
      {/* User card */}
      <Card
        style={{
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <Avatar initials={ME.initials} color={ME.color} size={68} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 22,
              marginBottom: 3,
              color: T.text,
            }}
          >
            {ME.name}
          </div>
          <div style={{ fontSize: 14, color: T.text2, marginBottom: 10 }}>{ME.bio}</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ fontSize: 13, color: T.text2 }}>
              <span style={{ color: T.text, fontWeight: 600 }}>{ME.eventsCount}</span> eventos
            </span>
            <span style={{ fontSize: 13, color: T.text2 }}>
              <span style={{ color: T.text, fontWeight: 600 }}>{ME.communitiesCount}</span>{' '}
              comunidades
            </span>
          </div>
        </div>
        <Button variant="ghost" sz="sm">
          Editar perfil
        </Button>
      </Card>

      {/* Communities */}
      <section style={{ marginBottom: 28 }}>
        <SectionLabel>Comunidades</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {COMMUNITIES.map(c => (
            <Card
              key={c.id}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: T.accentDim,
                  border: `1.5px solid ${T.accent}28`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  color: T.accent,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {c.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: T.text }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 12, color: T.text3 }}>{c.members} membros</div>
              </div>
              <Button variant="ghost" sz="sm" onClick={() => navigate(`/communities/${c.id}`)}>
                Ver
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section>
        <SectionLabel>Próximos eventos</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {myEvents.map(e => (
            <Card
              key={e.id}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px' }}
              onClick={() => navigate(`/events/${e.id}`)}
            >
              <DateChip dateLabel={e.dateLabel} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: T.text,
                  }}
                >
                  {e.title}
                </div>
                <div style={{ fontSize: 12, color: T.text3 }}>
                  {e.time} · {e.community.name}
                </div>
              </div>
              <RsvpPill status={e.myRsvp} />
            </Card>
          ))}
          {myEvents.length === 0 && (
            <div style={{ fontSize: 14, color: T.text3, textAlign: 'center', padding: '16px 0' }}>
              Nenhum evento próximo.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

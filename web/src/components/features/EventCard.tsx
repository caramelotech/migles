import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Card } from '../ui/Card'
import { DateChip } from '../ui/DateChip'
import { Avatar } from '../ui/Avatar'
import { RsvpPill } from '../ui/RsvpPill'
import type { Event } from '../../types'

export function EventCard({ event }: { event: Event }) {
  const { theme: T } = useTheme()
  const navigate = useNavigate()
  const spotsLeft = event.capacity != null ? event.capacity - event.rsvpCount : null

  return (
    <Card
      onClick={() => navigate(`/events/${event.id}`)}
      style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
    >
      <DateChip dateLabel={event.dateLabel} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 5,
          }}
        >
          <div
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 17,
              lineHeight: 1.25,
              color: T.text,
            }}
          >
            {event.title}
          </div>
          <RsvpPill status={event.myRsvp} />
        </div>
        <div style={{ fontSize: 13, color: T.text2, marginBottom: 10 }}>
          {event.time} · {event.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex' }}>
            {event.attendees.slice(0, 5).map((a, i) => (
              <div key={i} style={{ marginLeft: i === 0 ? 0 : -7 }}>
                <Avatar initials={a.initials} size={22} />
              </div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: T.text3 }}>
            {event.rsvpCount} confirmados{spotsLeft != null && ` · ${spotsLeft} vagas`}
          </span>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              color: T.accent,
              background: T.accentDim,
              padding: '2px 8px',
              borderRadius: 20,
              fontWeight: 500,
            }}
          >
            {event.community.name}
          </div>
        </div>
      </div>
    </Card>
  )
}

import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Card } from '../ui/Card'
import { RsvpPill } from '../ui/RsvpPill'
import { CalendarIcon, MapPinIcon, UsersIcon } from '../ui/icons'
import type { Event } from '../../types'

export function EventCard({ event }: { event: Event }) {
  const { theme: T } = useTheme()
  const navigate = useNavigate()
  const declined = event.myRsvp === 'declined'

  return (
    <Card
      onClick={() => navigate(`/events/${event.id}`)}
      style={{ padding: 0, overflow: 'hidden', opacity: declined ? 0.72 : 1 }}
    >
      {event.coverImage && (
        <img
          src={event.coverImage}
          alt=""
          style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
        />
      )}
      <div style={{ padding: '14px 16px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 12, color: T.text3, fontWeight: 500 }}>
            {event.community.name}
          </span>
          <RsvpPill status={event.myRsvp} />
        </div>
        <div
          style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.text, marginBottom: 4 }}
        >
          {event.title}
        </div>
        {event.description && (
          <div
            style={{
              fontSize: 13,
              color: T.text2,
              marginBottom: 10,
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {event.description}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: T.text2 }}
          >
            <CalendarIcon />
            {event.dateLabel} às {event.time}
          </div>
          {event.location && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 13,
                color: T.text2,
              }}
            >
              <MapPinIcon />
              {event.location}
            </div>
          )}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: T.text2 }}
          >
            <UsersIcon />
            {event.rsvpCount}
            {event.capacity ? ` / ${event.capacity}` : ''} confirmados
          </div>
        </div>
      </div>
    </Card>
  )
}

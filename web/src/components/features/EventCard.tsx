import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Card } from '../ui/Card'
import { RsvpPill } from '../ui/RsvpPill'
import type { Event } from '../../types'

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

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

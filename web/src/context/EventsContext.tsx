import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { INITIAL_EVENTS, ME } from '../data/mock'
import type { Event, RsvpStatus } from '../types'

type EventsContextValue = {
  events: Event[]
  updateRsvp: (eventId: string, status: RsvpStatus) => void
  addComment: (eventId: string, text: string, replyToId: string | null) => void
}

const EventsContext = createContext<EventsContextValue>({
  events: [],
  updateRsvp: () => {},
  addComment: () => {},
})

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS)

  function updateRsvp(eventId: string, status: RsvpStatus) {
    setEvents(evs =>
      evs.map(e => {
        if (e.id !== eventId) return e
        const wasConfirmed = e.myRsvp === 'confirmed'
        const nowConfirmed = status === 'confirmed'
        return {
          ...e,
          myRsvp: status,
          rsvpCount:
            nowConfirmed && !wasConfirmed
              ? e.rsvpCount + 1
              : !nowConfirmed && wasConfirmed
                ? e.rsvpCount - 1
                : e.rsvpCount,
        }
      }),
    )
  }

  function addComment(eventId: string, text: string, replyToId: string | null) {
    const newEntry = {
      id: Date.now().toString(),
      author: ME.name,
      initials: ME.initials,
      color: ME.color,
      text,
      time: 'agora',
      replies: [] as {
        id: string
        author: string
        initials: string
        color: string
        text: string
        time: string
      }[],
    }

    setEvents(evs =>
      evs.map(e => {
        if (e.id !== eventId) return e
        if (!replyToId) return { ...e, comments: [...e.comments, newEntry] }
        return {
          ...e,
          comments: e.comments.map(c =>
            c.id !== replyToId ? c : { ...c, replies: [...(c.replies ?? []), { ...newEntry }] },
          ),
        }
      }),
    )
  }

  return (
    <EventsContext.Provider value={{ events, updateRsvp, addComment }}>
      {children}
    </EventsContext.Provider>
  )
}

export const useEvents = () => useContext(EventsContext)

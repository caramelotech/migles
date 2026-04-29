import { useTheme } from '../context/ThemeContext'
import { useEvents } from '../context/EventsContext'
import { SectionLabel } from '../components/ui/SectionLabel'
import { EventCard } from '../components/features/EventCard'
import { ME } from '../data/mock'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function Home() {
  const { theme: T } = useTheme()
  const { events } = useEvents()

  const confirmed = events.filter(e => e.myRsvp === 'confirmed')
  const pending = events.filter(e => e.myRsvp === 'pending')
  const others = events.filter(e => e.myRsvp === 'declined' || e.myRsvp === 'waitlisted')

  return (
    <div className="fade-up" style={{ padding: '32px 24px', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 28,
            marginBottom: 5,
            color: T.text,
          }}
        >
          {greeting()}, {ME.name.split(' ')[0]} 👋
        </div>
        <div style={{ fontSize: 15, color: T.text2 }}>
          {confirmed.length} evento{confirmed.length !== 1 ? 's' : ''} confirmado
          {confirmed.length !== 1 ? 's' : ''} · {pending.length} aguardando resposta
        </div>
      </div>

      {confirmed.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <SectionLabel>Confirmados</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {confirmed.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <SectionLabel>Aguardando resposta</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <SectionLabel>Outros</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {others.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: T.text3 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 16, marginBottom: 6, color: T.text }}>Nenhum evento ainda</div>
          <div style={{ fontSize: 14 }}>
            Crie um evento ou entre em uma comunidade para começar.
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useEvents } from '../context/EventsContext'
import { SectionLabel } from '../components/ui/SectionLabel'
import { EventCard } from '../components/features/EventCard'
import { CalendarIcon, SearchIcon } from '../components/ui/icons'

export function Home() {
  const { theme: T } = useTheme()
  const { events } = useEvents()
  const [tab, setTab] = useState<'proximos' | 'meus'>('proximos')
  const [search, setSearch] = useState('')

  const confirmed = events.filter(e => e.myRsvp === 'confirmed')
  const pending = events.filter(e => e.myRsvp === 'pending')
  const others = events.filter(e => e.myRsvp === 'declined' || e.myRsvp === 'waitlisted')

  const q = search.trim().toLowerCase()
  const filtered = (list: typeof events) =>
    q ? list.filter(e => e.title.toLowerCase().includes(q)) : list

  return (
    <div className="fade-up" style={{ padding: '28px 24px', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 18 }}>
          Eventos
        </div>

        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: T.text3,
              pointerEvents: 'none',
              display: 'flex',
            }}
          >
            <SearchIcon />
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar eventos..."
            style={{
              width: '100%',
              background: T.s2,
              border: `1.5px solid ${T.border}`,
              borderRadius: 24,
              color: T.text,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14,
              padding: '10px 14px 10px 42px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setTab('proximos')}
            style={{
              padding: '8px 18px',
              borderRadius: 22,
              border: tab === 'proximos' ? 'none' : `1.5px solid ${T.border}`,
              cursor: 'pointer',
              background: tab === 'proximos' ? T.accentDim : 'transparent',
              color: tab === 'proximos' ? T.accent : T.text2,
              fontFamily: 'DM Sans',
              fontSize: 14,
              fontWeight: tab === 'proximos' ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <CalendarIcon />
            Próximos
          </button>
          <button
            onClick={() => setTab('meus')}
            style={{
              padding: '8px 18px',
              borderRadius: 22,
              border: tab === 'meus' ? 'none' : `1.5px solid ${T.border}`,
              cursor: 'pointer',
              background: tab === 'meus' ? T.accentDim : 'transparent',
              color: tab === 'meus' ? T.accent : T.text2,
              fontFamily: 'DM Sans',
              fontSize: 14,
              fontWeight: tab === 'meus' ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            Meus Eventos
          </button>
        </div>
      </div>

      {tab === 'proximos' && (
        <>
          {confirmed.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <SectionLabel>Confirmados</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered(confirmed).map(e => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}
          {pending.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <SectionLabel>Aguardando resposta</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered(pending).map(e => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}
          {others.length > 0 && (
            <section>
              <SectionLabel>Outros</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered(others).map(e => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}
          {events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: T.text3 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 16, marginBottom: 6, color: T.text }}>
                Nenhum evento ainda
              </div>
              <div style={{ fontSize: 14 }}>
                Crie um evento ou entre em uma comunidade para começar.
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'meus' && (
        <section>
          {confirmed.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered(confirmed).map(e => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: T.text3 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <div style={{ fontSize: 16, marginBottom: 6, color: T.text }}>
                Nenhum evento confirmado
              </div>
              <div style={{ fontSize: 14 }}>Confirme presença em eventos para vê-los aqui.</div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

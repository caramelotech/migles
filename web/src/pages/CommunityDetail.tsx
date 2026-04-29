import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useEvents } from '../context/EventsContext'
import { Card } from '../components/ui/Card'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { EventCard } from '../components/features/EventCard'
import { ArrowLeftIcon } from '../components/ui/icons'
import { COMMUNITIES, COMMUNITY_MEMBERS, COMMUNITY_DESCRIPTIONS, ME } from '../data/mock'

export function CommunityDetail() {
  const { theme: T } = useTheme()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { events } = useEvents()

  const community = COMMUNITIES.find(c => c.id === id)
  if (!community)
    return (
      <div style={{ padding: 32, color: T.text2, textAlign: 'center' }}>
        Comunidade não encontrada.
        <br />
        <br />
        <Button variant="ghost" onClick={() => navigate('/')}>
          ← Voltar
        </Button>
      </div>
    )

  const members = COMMUNITY_MEMBERS[community.id] ?? []
  const commEvents = events.filter(e => e.community.id === community.id)
  const isAdmin = members.find(m => m.initials === ME.initials)?.role === 'admin'

  const [tab, setTab] = useState<'eventos' | 'membros' | 'configs'>('eventos')
  const [memberSearch, setMemberSearch] = useState('')
  const [showInvite, setShowInvite] = useState(false)

  const filtered = members.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()))

  const TABS = [
    { id: 'eventos', label: `Eventos (${commEvents.length})` },
    { id: 'membros', label: `Membros (${members.length})` },
    { id: 'configs', label: 'Configurações' },
  ] as const

  return (
    <div className="fade-up" style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: T.text2,
          cursor: 'pointer',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 20,
          fontFamily: 'DM Sans',
          padding: 0,
        }}
      >
        <ArrowLeftIcon /> Voltar
      </button>

      {/* Community hero */}
      <div
        style={{
          background: T.accentDim,
          border: `1px solid ${T.accent}22`,
          borderRadius: 16,
          padding: 24,
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: T.accent + '18',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 14,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: T.accent + '22',
              border: `2px solid ${T.accent}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color: T.accent,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {community.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 22,
                marginBottom: 2,
                color: T.text,
              }}
            >
              {community.name}
            </h1>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 12, color: T.text2 }}>{members.length} membros</span>
              <span style={{ fontSize: 12, color: T.text2 }}>·</span>
              <span style={{ fontSize: 12, color: T.accent, fontWeight: 500 }}>
                {community.type === 'public' ? 'Pública' : 'Privada'}
              </span>
            </div>
          </div>
          {isAdmin && (
            <Button variant="ghost" sz="sm">
              Editar
            </Button>
          )}
        </div>
        <p
          style={{
            fontSize: 13,
            color: T.text2,
            lineHeight: 1.6,
            marginBottom: 16,
            position: 'relative',
          }}
        >
          {COMMUNITY_DESCRIPTIONS[community.id]}
        </p>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <Button sz="sm" onClick={() => setShowInvite(true)}>
            Convidar pessoas
          </Button>
          <Button variant="ghost" sz="sm">
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div
          className="fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={e => e.target === e.currentTarget && setShowInvite(false)}
        >
          <div
            style={{
              background: T.s1,
              borderRadius: 16,
              padding: 24,
              maxWidth: 400,
              width: '100%',
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 18,
                marginBottom: 4,
                color: T.text,
              }}
            >
              Convidar pessoas
            </div>
            <div style={{ fontSize: 13, color: T.text2, marginBottom: 16 }}>
              Compartilhe o link de convite da comunidade
            </div>
            <div
              style={{
                background: T.s2,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: T.text3,
                marginBottom: 12,
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}
            >
              migles.app/c/{community.id}/join?ref=abc123
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button full onClick={() => setShowInvite(false)}>
                Copiar link
              </Button>
              <Button variant="ghost" onClick={() => setShowInvite(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          background: T.s2,
          borderRadius: 12,
          padding: 4,
          marginBottom: 20,
        }}
      >
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              fontSize: 13,
              fontWeight: tab === t.id ? 500 : 400,
              background: tab === t.id ? T.s1 : 'transparent',
              color: tab === t.id ? T.text : T.text2,
              boxShadow: tab === t.id ? `0 1px 3px rgba(0,0,0,0.15)` : 'none',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Eventos */}
      {tab === 'eventos' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {commEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: T.text3, fontSize: 14 }}>
              Nenhum evento ainda.
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => navigate('/events/new')}>Criar evento</Button>
              </div>
            </div>
          )}
          {commEvents.map(e => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      {/* Tab: Membros */}
      {tab === 'membros' && (
        <div className="fade-in">
          <div style={{ marginBottom: 12 }}>
            <input
              value={memberSearch}
              onChange={e => setMemberSearch(e.target.value)}
              placeholder="Buscar membro..."
              style={{
                width: '100%',
                background: T.s2,
                border: `1.5px solid ${T.border}`,
                borderRadius: 14,
                color: T.text,
                fontFamily: 'DM Sans',
                fontSize: 14,
                padding: '9px 14px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((m, i) => (
              <Card
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}
              >
                <Avatar initials={m.initials} color={m.color} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: T.text }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: 12, color: T.text3 }}>
                    {m.name === ME.name ? 'Você · ' : ''}
                    <span style={{ color: m.role === 'admin' ? T.accent : T.text3 }}>
                      {m.role === 'admin' ? 'Admin' : 'Membro'}
                    </span>
                  </div>
                </div>
                {isAdmin && m.name !== ME.name && (
                  <Button variant="ghost" sz="sm">
                    ···
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Configurações */}
      {tab === 'configs' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isAdmin && (
            <div
              style={{
                background: T.amberDim,
                border: `1px solid ${T.amber}28`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: T.amber,
              }}
            >
              Apenas admins podem editar configurações.
            </div>
          )}
          <Field
            label="Nome da comunidade"
            value={community.name}
            onChange={() => {}}
            disabled={!isAdmin}
          />
          <Field
            label="Descrição"
            value={COMMUNITY_DESCRIPTIONS[community.id] ?? ''}
            onChange={() => {}}
            textarea
            disabled={!isAdmin}
          />

          <div>
            <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 8 }}>
              Tipo de comunidade
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(
                [
                  ['public', '🌐 Pública'],
                  ['private', '🔒 Privada'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  disabled={!isAdmin}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 14,
                    fontFamily: 'DM Sans',
                    fontSize: 13,
                    background: community.type === val ? T.accentDim : T.s2,
                    border: `1.5px solid ${community.type === val ? T.accent + '40' : T.border}`,
                    color: community.type === val ? T.accent : T.text2,
                    cursor: isAdmin ? 'pointer' : 'default',
                    opacity: isAdmin ? 1 : 0.5,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 8 }}>
              Mecanismos de entrada
            </div>
            {(
              [
                ['link', 'Link de convite / QR code'],
                ['request', 'Solicitação + aprovação'],
                ['open', 'Entrada livre'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: `1px solid ${T.border}`,
                  cursor: isAdmin ? 'pointer' : 'default',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `2px solid ${key !== 'request' ? T.accent : T.border}`,
                    background: key !== 'request' ? T.accentDim : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {key !== 'request' && <span style={{ fontSize: 10, color: T.accent }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: T.text }}>{label}</span>
              </label>
            ))}
          </div>

          {isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
              <Button full>Salvar configurações</Button>
              <div style={{ height: 1, background: T.border }} />
              <Button variant="danger" full>
                Excluir comunidade
              </Button>
            </div>
          )}

          <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
            <Button variant="danger" full>
              Sair da comunidade
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

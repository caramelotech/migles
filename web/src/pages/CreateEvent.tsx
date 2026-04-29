import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Field } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { COMMUNITIES } from '../data/mock'

type FormState = {
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: string
  visibility: 'private' | 'community'
  community: string
}

export function CreateEvent() {
  const { theme: T } = useTheme()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>({
    title: '', description: '', date: '', time: '', location: '',
    capacity: '', visibility: 'private', community: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [done, setDone] = useState(false)

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  function validateStep1() {
    const e: typeof errors = {}
    if (!form.title.trim()) e.title = 'Título é obrigatório'
    if (!form.date)         e.date  = 'Escolha uma data'
    if (!form.time)         e.time  = 'Escolha um horário'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() { if (validateStep1()) setStep(2) }

  function submit() {
    setDone(true)
    setTimeout(() => navigate('/'), 1800)
  }

  if (done) return (
    <div className="scale-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', background: T.greenDim,
        border: `2px solid rgba(74,222,128,0.3)`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 26, color: T.green,
      }}>✓</div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: T.text }}>Evento criado!</div>
      <div style={{ color: T.text2, fontSize: 14 }}>Redirecionando para o início…</div>
    </div>
  )

  return (
    <div className="fade-up" style={{ maxWidth: 540, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, marginBottom: 4, color: T.text }}>Criar evento</div>
        <div style={{ color: T.text2, fontSize: 14 }}>Passo {step} de 2</div>
        <div style={{ height: 3, background: T.s3, borderRadius: 3, marginTop: 12, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: T.accent, borderRadius: 3, width: step === 1 ? '50%' : '100%', transition: 'width 0.35s ease' }} />
        </div>
      </div>

      {step === 1 ? (
        <div key="s1" className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Título do evento" value={form.title} onChange={v => set('title', v)}
            placeholder="Ex: Churrasco de aniversário" required error={errors.title} />
          <Field label="Descrição" value={form.description} onChange={v => set('description', v)}
            placeholder="Conta um pouco sobre o evento…" textarea />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Data" value={form.date} onChange={v => set('date', v)} type="date" required error={errors.date} />
            <Field label="Horário" value={form.time} onChange={v => set('time', v)} type="time" required error={errors.time} />
          </div>
          <Field label="Local" value={form.location} onChange={v => set('location', v)} placeholder="Ex: Parque Ibirapuera, SP" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button onClick={next} sz="lg">Próximo →</Button>
          </div>
        </div>
      ) : (
        <div key="s2" className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Limite de vagas" value={form.capacity} onChange={v => set('capacity', v)}
            type="number" placeholder="Deixe vazio para sem limite" min="1"
            hint="Ao atingir o limite, novos confirmados entram na lista de espera." />

          <div>
            <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 8 }}>Visibilidade</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {([['private', '🔒 Privado'], ['community', '👥 Comunidade']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => set('visibility', val)}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 14,
                    background: form.visibility === val ? T.accentDim : T.s2,
                    border: `1.5px solid ${form.visibility === val ? 'rgba(155,135,245,0.4)' : T.border}`,
                    color: form.visibility === val ? T.accentLight : T.text2,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {form.visibility === 'community' && (
            <div className="fade-in">
              <div style={{ fontSize: 13, color: T.text2, fontWeight: 500, marginBottom: 8 }}>Vincular comunidade</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {COMMUNITIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => set('community', c.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10,
                      background: form.community === c.id ? c.color + '14' : T.s2,
                      border: `1.5px solid ${form.community === c.id ? c.color + '40' : T.border}`,
                      color: form.community === c.id ? c.color : T.text2,
                      cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 14, textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: c.color }} />
                    {c.name}
                    <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }}>{c.members} membros</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Button variant="ghost" sz="lg" onClick={() => setStep(1)}>← Voltar</Button>
            <Button sz="lg" onClick={submit} full>Criar evento</Button>
          </div>
        </div>
      )}
    </div>
  )
}

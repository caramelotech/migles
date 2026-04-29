import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import type { Comment } from '../../types'

type Props = {
  comment: Comment
  onReply: (commentId: string, text: string) => void
}

export function CommentThread({ comment, onReply }: Props) {
  const { theme: T } = useTheme()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  function submit() {
    if (!text.trim()) return
    onReply(comment.id, text.trim())
    setText('')
    setOpen(false)
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Avatar initials={comment.initials} color={comment.color} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{comment.author}</span>
          <span style={{ fontSize: 12, color: T.text3 }}>{comment.time}</span>
        </div>
        <div style={{ fontSize: 14, color: T.text, lineHeight: 1.65, marginBottom: 8 }}>
          {comment.text}
        </div>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: 'none',
            border: 'none',
            color: T.text3,
            fontSize: 12,
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'DM Sans',
          }}
        >
          ↩ Responder
        </button>

        {comment.replies && comment.replies.length > 0 && (
          <div
            style={{
              marginTop: 12,
              paddingLeft: 14,
              borderLeft: `2px solid ${T.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {comment.replies.map(r => (
              <div key={r.id} style={{ display: 'flex', gap: 8 }}>
                <Avatar initials={r.initials} color={r.color} size={26} />
                <div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 3, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{r.author}</span>
                    <span style={{ fontSize: 11, color: T.text3 }}>{r.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{r.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {open && (
          <div
            className="fade-in"
            style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}
          >
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Escrever resposta…"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                flex: 1,
                background: T.s2,
                border: `1.5px solid rgba(155,135,245,0.3)`,
                borderRadius: 8,
                color: T.text,
                fontFamily: 'DM Sans',
                fontSize: 13,
                padding: '7px 12px',
                outline: 'none',
              }}
            />
            <Button sz="sm" onClick={submit} disabled={!text.trim()}>
              Enviar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

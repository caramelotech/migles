# Migles

**Migles** é um aplicativo multiplataforma (mobile + web) para gerenciamento de eventos sociais. Permite que grupos de amigos e comunidades organizem eventos com RSVP, waitlist e gestão de membros.

> **Nota:** Migles NÃO é uma plataforma de mensagens. Ele complementa WhatsApp/Telegram organizando o que acontece fora deles.

## 🏗️ Arquitetura

Monorepo com pnpm workspaces:

```
migles/
├── api/       - Backend com NestJS
├── mobile/    - App nativo com React Native
├── web/       - Web com React (GitHub Pages temporariamente)
└── packages/  - Pacotes compartilhados
```

## 🛠️ Stack de Tecnologia

### Backend (`api/`)

- **Framework:** NestJS
- **Linguagem:** TypeScript (strict mode)
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Validação:** Zod
- **Queue:** BullMQ + Redis
- **Testes:** Vitest

### Frontend Web (`web/`)

- **Framework:** React 18 + Vite
- **Linguagem:** TypeScript (strict mode)
- **Roteamento:** React Router DOM v6 (HashRouter)
- **Deploy:** GitHub Pages — https://caramelotech.github.io/migles/

### Frontend Mobile (`mobile/`)

- **Framework:** React Native

## 🚀 Primeiros Passos

### Pré-requisitos

```bash
npm install -g pnpm   # gerenciador de pacotes do monorepo
```

### Instalar todas as dependências

```bash
# a partir da raiz do projeto
pnpm install
```

---

### Backend (`api/`)

1. Copie o arquivo de ambiente:

```bash
cp api/.env.example api/.env
```

2. Preencha as variáveis obrigatórias em `api/.env`:
   - `DATABASE_URL` — conexão PostgreSQL
   - `JWT_SECRET` — chave para JWT
   - `REDIS_URL` — conexão Redis
   - Credenciais OAuth (Google, Apple)

3. Inicie o desenvolvimento:

```bash
pnpm api:dev
# ou dentro de api/: pnpm dev
```

#### Comandos do backend (dentro de `api/`)

| Comando              | Descrição                 |
| -------------------- | ------------------------- |
| `pnpm dev`           | Inicia com watch mode     |
| `pnpm build`         | Compila                   |
| `pnpm test`          | Executa testes com Vitest |
| `pnpm test:coverage` | Relatório de cobertura    |
| `pnpm db:migrate`    | Prisma migrate dev        |
| `pnpm db:generate`   | Regenera Prisma client    |
| `pnpm db:studio`     | Abre Prisma Studio        |
| `pnpm db:seed`       | Seed com dados iniciais   |

---

### Web (`web/`)

```bash
pnpm web:dev      # servidor de desenvolvimento em localhost:5173
pnpm web:build    # build de produção
pnpm web:preview  # preview do build local
```

O deploy para GitHub Pages acontece automaticamente via GitHub Actions quando há push na branch `main` com alterações em `web/`. Também pode ser disparado manualmente em **Actions → Deploy web to GitHub Pages → Run workflow**.

> Para ativar o deploy pela primeira vez: **Settings → Pages → Source → GitHub Actions**

---

## 📋 Estrutura de Módulos

Os módulos do backend (`api/src/modules/`) seguem o padrão:

- `auth` — Autenticação e estratégias OAuth
- `users` — Gerenciamento de usuários
- `events` — Gestão de eventos
- `communities` — Gerenciamento de comunidades
- `rsvp` — Sistema de confirmação de presença
- `comments` — Comentários em eventos

Cada módulo possui: controller, service, repository, schema Zod e types.

## 🎯 Regras de Domínio

- Um evento deve ter **pelo menos um organizador**
- Promoção automática de waitlist (FIFO) quando confirmado cancela
- Estados RSVP: `pending` → `confirmed` | `declined` | `waitlisted`
- Visibilidade: `PRIVATE` (só convidados) ou `COMMUNITY` (membros da comunidade)
- Status de membro: `ACTIVE` | `PENDING` | `BANNED`
- Apenas admins da comunidade podem criar eventos ligados a uma comunidade

## 📖 Especificações

Todas as decisões de produto e arquitetura estão documentadas em `specs/`:

| Arquivo                  | Conteúdo                                    |
| ------------------------ | ------------------------------------------- |
| `specs/spec-v1.md`       | Especificação de produto v1                 |
| `specs/backend.md`       | Spec e prompt de setup do backend           |
| `specs/design-system.md` | Sistema de design (tokens, componentes, DS) |

Para mudanças no produto, atualize a spec **antes** de implementar.

## 📝 Licença

MIT

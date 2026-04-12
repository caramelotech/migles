# Migles

**Migles** é um aplicativo multiplataforma (mobile + web) para gerenciamento de eventos sociais. Permite que grupos de amigos e comunidades organizem eventos com RSVP, waitlist e gestão de membros.

> **Nota:** Migles NÃO é uma plataforma de mensagens. Ele complementa WhatsApp/Telegram organizando o que acontece fora deles.

## 🏗️ Arquitetura

Monorepo com pnpm workspaces:

```
migles/
├── api/       - Backend com NestJS
├── mobile/    - App nativo com React Native
├── web/       - Web com React
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

### Frontend
- **Mobile:** React Native
- **Web:** React

## 🚀 Primeiros Passos

### Configuração do Backend

1. Copie o arquivo de ambiente:
```bash
cp api/.env.example api/.env
```

2. Preencha as variáveis obrigatórias:
   - `DATABASE_URL` - conexão PostgreSQL
   - `JWT_SECRET` - chave para JWT
   - `REDIS_URL` - conexão Redis
   - Credenciais OAuth (Google, Apple)

3. Instale dependências e inicie o desenvolvimento:
```bash
# a partir da raiz do projeto
pnpm install
pnpm -F=api dev
```

### Comandos do Backend

Execute dentro de `api/`:

```bash
pnpm dev              # inicia com watch mode
pnpm build            # compila
pnpm test             # executa testes com Vitest
pnpm test:coverage    # relatório de cobertura
pnpm db:migrate       # Prisma migrate dev
pnpm db:generate      # regenera Prisma client
pnpm db:studio        # abre Prisma Studio
pnpm db:seed          # seed com dados iniciais
```

## 📋 Estrutura de Módulos

Os módulos do backend (`api/src/modules/`) seguem o padrão:

- `auth` - Autenticação e estratégias OAuth
- `users` - Gerenciamento de usuários
- `events` - Gestão de eventos
- `communities` - Gerenciamento de comunidades
- `rsvp` - Sistema de confirmação de presença
- `comments` - Comentários em eventos

Cada módulo possui: controller, service, repository, schema Zod e types.

## 🎯 Regras de Domínio

- Um evento deve ter **at least um organizador**
- Promoção automática de waitlist (FIFO) quando confirmado cancela
- Estados RSVP: `pending` → `confirmed` | `declined` | `waitlisted`
- Visibilidade: `PRIVATE` (só convidados) ou `COMMUNITY` (membros da comunidade)
- Status de membro: `ACTIVE` | `PENDING` | `BANNED`
- Apenas admins da comunidade podem criar eventos ligados a uma comunidade

## 📖 Especificações

Todas as decisões de produto e arquitetura estão documentadas em `specs/spec-v1.md`.

Para mudanças no produto, atualize a spec ANTES de implementar.

## 📝 Licença

MIT

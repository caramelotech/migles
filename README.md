# Migles

Plataforma multiplataforma (mobile + web) para organização de eventos sociais entre amigos e comunidades.

> **Migles não é uma plataforma de mensagens.** Ele complementa WhatsApp/Telegram organizando o que acontece fora deles.

## Arquitetura

Monorepo com pnpm workspaces:

```
migles/
├── src/       - Web (Next.js 15)
├── supabase/  - Migrações SQL e configuração
├── docs/      - Especificações de produto e design
├── app/       - Mobile com React Native (futuro)
└── packages/  - Pacotes compartilhados (futuro)
```

## Stack

| Camada         | Tecnologia                                      |
| -------------- | ----------------------------------------------- |
| Web            | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Mobile         | React Native (futuro)                           |
| Banco de dados | PostgreSQL via Supabase com Row Level Security  |
| Auth           | Supabase Auth                                   |
| Storage        | Supabase Storage                                |

## Requisitos

- Node.js 20+
- npm 10+
- Conta no [Supabase](https://supabase.com)

## Configuração inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie (ou edite) o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Necessário apenas para rodar db:seed
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

As chaves ficam em: **Supabase Dashboard > Project Settings > API**.

### 3. Aplicar migrações no banco

Autentique-se no Supabase CLI, vincule o projeto e aplique as migrações:

```bash
npx supabase login
npm run db:link
npm run db:push
```

O `db:link` vai pedir a senha do banco (disponível em **Project Settings > Database > Database password**).

## Desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Scripts disponíveis

| Script            | Descrição                                     |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento                   |
| `npm run build`   | Build de produção                             |
| `npm run start`   | Inicia o build de produção                    |
| `npm run lint`    | Verifica problemas de lint                    |
| `npm run format`  | Formata o código com Prettier                 |
| `npm run db:link` | Vincula o projeto Supabase ao projeto remoto  |
| `npm run db:push` | Aplica as migrações pendentes no banco remoto |
| `npm run db:seed` | Cria o usuário de teste padrão                |

## Estrutura do projeto

```
src/
  app/
    (protected)/       - Rotas autenticadas (eventos, comunidades, perfil)
    api/               - API Routes do Next.js (operações server-side)
    i/[code]/          - Página de convite por link
    login/             - Login e cadastro
  components/          - Componentes de UI (shadcn/ui)
  integrations/
    supabase/          - Clientes Supabase (client-side e server-side) e tipos gerados
  lib/                 - Contextos de auth e tema, utilitários e helpers
  services/            - Acesso a dados e lógica de negócio (via Supabase client)
supabase/
  migrations/          - Migrações SQL do banco de dados
docs/
  spec-v1.md           - Especificação de produto
  design-system.md     - Sistema de design (tokens, componentes)
```

## Banco de dados

O schema inclui as tabelas: `profiles`, `communities`, `community_members`, `events`, `event_organizers`, `rsvps` e `event_comments`.

Todas as tabelas usam Row Level Security (RLS). As migrações ficam em `supabase/migrations/` e são aplicadas em ordem cronológica pelo `db:push`.

## Regras de domínio

- Todo evento deve ter **pelo menos um organizador**
- Promoção automática de waitlist (FIFO) quando um confirmado cancela
- Estados RSVP: `pending` -> `confirmed` | `declined` | `waitlisted`
- Visibilidade: `private` (só convidados) ou `community` (membros da comunidade)
- Status de membro: `ACTIVE` | `PENDING` | `BANNED`
- Apenas admins da comunidade podem criar eventos vinculados a ela

## Especificações

Todas as decisões de produto e arquitetura estão documentadas em `docs/`:

| Arquivo                 | Conteúdo                                |
| ----------------------- | --------------------------------------- |
| `docs/spec-v1.md`       | Especificação de produto v1             |
| `docs/design-system.md` | Sistema de design (tokens, componentes) |

Para mudanças no produto, atualize a spec **antes** de implementar.

## Licença

MIT

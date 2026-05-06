# Migles — Product Specification v1

> **Spec Driven Development**
> Todo desenvolvimento parte deste spec. Mudanças no produto devem refletir aqui antes (ou junto) de virar código.

| Campo  | Valor                                       |
| ------ | ------------------------------------------- |
| Versão | 1.0                                         |
| Status | `[em discussão]`                            |
| Data   | Abril 2026                                  |
| Time   | 2–4 pessoas                                 |
| Stack  | React Native · Next.js 15 · Supabase |

## Índice

1. [Visão do Produto](#1-visão-do-produto)
2. [Problema](#2-problema)
3. [Público-alvo](#3-público-alvo)
4. [Filosofia e Princípios](#4-filosofia-e-princípios)
5. [Escopo do MVP](#5-escopo-do-mvp)
6. [Domínios e Entidades](#6-domínios-e-entidades)
7. [Requisitos Funcionais](#7-requisitos-funcionais)
8. [Regras de Negócio](#8-regras-de-negócio)
9. [Requisitos Não-Funcionais](#9-requisitos-não-funcionais)
10. [Questões em Aberto](#10-questões-em-aberto)
11. [Fora do Escopo](#11-fora-do-escopo)
12. [Histórico de Mudanças](#12-histórico-de-mudanças)

## 1. Visão do Produto

**Migles** é uma plataforma multiplataforma (mobile + web) para organização e gerenciamento de eventos sociais entre amigos e comunidades.

O produto centraliza a coordenação de encontros — controle de presença, limite de vagas, lista de espera e comunicação — funcionando como **camada de organização complementar** às ferramentas de comunicação já utilizadas pelos usuários (WhatsApp, Telegram, Discord).

> **Migles não substitui plataformas de comunicação. Migles organiza o que acontece fora delas.**

### Visão de longo prazo

Tornar-se a principal plataforma para organização e descoberta de eventos sociais e comunitários, facilitando tanto encontros privados quanto a descoberta de novas comunidades e experiências.

## 2. Problema

Organizar eventos sociais informalmente é fragmentado e pouco eficiente:

- Confirmações de presença são manuais e se perdem em conversas de grupo
- Informações sobre participantes ficam espalhadas e sem histórico
- Controle de limite de vagas e lista de espera é inexistente ou feito à mão
- Comunidades não têm ferramentas para divulgar e gerenciar seus próprios eventos
- Discussões importantes sobre o evento se perdem no histórico de chats

## 3. Público-alvo

### Usuário primário

Pessoas que organizam ou participam frequentemente de:

- Encontros entre amigos
- Eventos de hobbies e interesses
- Grupos sociais recorrentes
- Comunidades temáticas

**Padrão de uso esperado:** semanal — consulta de agenda, confirmação de presença e descoberta de próximos eventos.

### Usuário secundário

Organizadores e moderadores de comunidades que precisam de ferramentas de gestão de membros e eventos.

## 4. Filosofia e Princípios

### Evento é o objeto central

O **evento** é a entidade principal da plataforma. Toda feature deve servir à criação, descoberta ou participação em eventos.

Comunidades atuam como:

- Agrupadores de usuários com interesses comuns
- Centralizadores de eventos recorrentes
- Facilitadores de descoberta

### Complementaridade, não substituição

O Migles não compete com WhatsApp ou outros mensageiros. Ele se integra a eles via compartilhamento de links e convites externos.

### Simplicidade primeiro

Discovery inteligente, recomendações algorítmicas e social graph complexo são evoluções futuras. O MVP prioriza o fluxo core: criar evento → convidar → confirmar presença → gerenciar.

## 5. Escopo do MVP

### Incluído

| Pilar                     | Descrição                                                                        |
| ------------------------- | -------------------------------------------------------------------------------- |
| **Event Management**      | Criação, gestão de participantes, RSVP, lista de espera, múltiplos organizadores |
| **Community Basic Layer** | Criação, entrada (pública/privada/convite), gestão básica de membros             |

### Explicitamente fora do MVP

Ver seção [11. Fora do Escopo](#11-fora-do-escopo).

## 6. Domínios e Entidades

### 6.1 Usuário

Representa qualquer pessoa cadastrada na plataforma.

**Atributos principais:** nome, e-mail, foto de perfil, método de autenticação.

**Papéis possíveis (por contexto):**

- `participant` — em eventos
- `organizer` — em eventos
- `member` — em comunidades
- `admin` — em comunidades

> Um mesmo usuário pode ter papéis diferentes em contextos diferentes.

### 6.2 Evento

Objeto central da plataforma. Representa um encontro com data, local e participantes.

**Atributos principais:**

| Atributo             | Tipo     | Obrigatório | Notas                                         |
| -------------------- | -------- | ----------- | --------------------------------------------- |
| Título               | string   | sim         | —                                             |
| Descrição            | string   | não         | —                                             |
| Data e horário       | datetime | sim         | —                                             |
| Local                | string   | não         | Presencial ou online                          |
| Limite de vagas      | integer  | não         | Null = sem limite                             |
| Visibilidade         | enum     | sim         | `private` · `community`                       |
| Comunidade vinculada | relation | não         | Requer papel de admin/organizer na comunidade |

**Estados do evento:** `draft` · `published` · `cancelled` · `finished`

### 6.3 RSVP

Representa a relação entre um usuário e um evento.

**Estados possíveis:**

| Estado       | Descrição                         |
| ------------ | --------------------------------- |
| `pending`    | Convidado, ainda não respondeu    |
| `confirmed`  | Confirmou presença                |
| `declined`   | Recusou o convite                 |
| `waitlisted` | Confirmou, mas evento está lotado |

### 6.4 Comunidade

Agrupa usuários com interesses comuns e centraliza seus eventos.

**Atributos principais:**

| Atributo              | Tipo   | Obrigatório | Notas                |
| --------------------- | ------ | ----------- | -------------------- |
| Nome                  | string | sim         | —                    |
| Descrição             | string | não         | —                    |
| Avatar/foto           | image  | não         | —                    |
| Tipo                  | enum   | sim         | `public` · `private` |
| Mecanismos de entrada | flags  | sim         | Ver seção 7.2        |

### 6.5 Comentário

Interação textual vinculada a um evento. Suporta threads (respostas aninhadas).

**Visibilidade:** segue as regras do evento ao qual pertence (ver seção 8.3).

## 7. Requisitos Funcionais

### 7.1 Autenticação

- [ ] Cadastro e login via **e-mail e senha** com validação de e-mail
- [ ] Login social via **Google**
- [ ] Login social via **Apple**
- [ ] Sessão persistente com renovação automática de token (JWT)
- [ ] Todas as modalidades disponíveis em mobile e web

### 7.2 Gestão de Eventos

#### Criação

- [ ] Criar evento com título, descrição, data, horário e local
- [ ] Definir limite de vagas (opcional)
- [ ] Vincular evento a uma comunidade (requer ser admin/organizer da comunidade)
- [ ] Definir visibilidade: `private` ou `community`
- [ ] Definir múltiplos organizadores no momento da criação ou posteriormente

#### Participantes e Convites

- [ ] Convidar usuários da plataforma diretamente (por nome ou busca)
- [ ] Gerar link de convite compartilhável
- [ ] Gerar QR code do evento
- [ ] Compartilhar evento via WhatsApp (deep link para a plataforma web)
- [ ] Organizador pode remover RSVP de participante manualmente

#### RSVP

- [ ] Participante pode confirmar presença (`confirmed`)
- [ ] Participante pode recusar convite (`declined`)
- [ ] Participante pode alterar sua resposta enquanto o evento não ocorreu
- [ ] Estado inicial ao receber convite: `pending`

#### Lista de Espera

- [ ] Ao atingir o limite de vagas, novos confirmados entram automaticamente em `waitlisted`
- [ ] Em caso de desistência, o próximo da fila é promovido automaticamente para `confirmed`
- [ ] Usuário promovido recebe notificação

#### Comentários

- [ ] Participantes podem comentar no evento
- [ ] Comentários suportam threads (respostas aninhadas)
- [ ] Compartilhar comentário específico via WhatsApp
- [ ] Admins/organizadores podem moderar (remover) comentários

### 7.3 Gestão de Comunidades

#### Criação

- [ ] Qualquer usuário pode criar uma comunidade, tornando-se automaticamente admin
- [ ] Definir nome, descrição e avatar
- [ ] Definir tipo: `public` ou `private`
- [ ] Configurar mecanismos de entrada habilitados (combinação possível):
  - Link de convite / QR code
  - Solicitação + aprovação do admin
  - Entrada livre (somente comunidades públicas)

#### Entrada de Membros

- [ ] Buscar comunidade por nome ou código
- [ ] Entrar diretamente em comunidade pública
- [ ] Solicitar entrada em comunidade privada
- [ ] Admin pode convidar usuário diretamente
- [ ] Admin aprova ou recusa solicitações pendentes

#### Administração

- [ ] Admin pode remover membros
- [ ] Admin pode banir membros permanentemente (impede reentrada via link)
- [ ] Admin pode moderar comentários de eventos da comunidade
- [ ] Admin pode gerenciar denúncias/reportes

### 7.4 Discovery e Compartilhamento

- [ ] Busca manual de comunidades por nome ou código
- [ ] Descoberta de eventos via comunidades das quais o usuário faz parte
- [ ] Compartilhamento viral por links (evento e comunidade)
- [ ] Preview público de evento acessível sem login (via web)

## 8. Regras de Negócio

### 8.1 Ownership de Evento

- Todo evento deve ter ao menos um organizador
- Evento não pode existir sem owner
- O criador do evento é automaticamente organizador
- Organizadores têm as mesmas permissões de gestão do evento

### 8.2 Waitlist

- Limite de vagas `null` desabilita completamente a lista de espera
- A promoção da fila é automática — não requer ação do organizador
- A ordem da lista de espera segue a ordem de confirmação (FIFO)

### 8.3 Visibilidade e Privacidade

| Contexto               | Quem pode visualizar  | Quem pode comentar           |
| ---------------------- | --------------------- | ---------------------------- |
| Evento privado         | Apenas convidados     | Apenas convidados            |
| Evento de comunidade   | Membros da comunidade | Membros da comunidade        |
| Preview via link (web) | Qualquer pessoa       | Não se aplica (requer login) |

- Evento privado pode ter seu link compartilhado/reencaminhado
- Usuários banidos/bloqueados não acessam o evento via link

### 8.4 Papéis em Comunidade

- Um usuário pode ser admin em uma comunidade e membro simples em outra
- Apenas admins podem criar eventos vinculados à comunidade
- Apenas admins podem aprovar/rejeitar membros em comunidades privadas

### 8.5 Moderação

- Usuário banido de uma comunidade não pode reingressar por nenhum mecanismo (link, busca ou convite)
- Denúncias são recebidas pelos admins da comunidade; não há moderação centralizada no MVP

## 9. Requisitos Não-Funcionais

### 9.1 Plataformas

| Plataforma     | Tech                 | Responsabilidade principal                           |
| -------------- | -------------------- | ---------------------------------------------------- |
| Mobile iOS     | React Native         | Interface primária do usuário                        |
| Mobile Android | React Native         | Interface primária do usuário                        |
| Web            | Next.js 15           | Preview de eventos, acesso via links, gestão desktop |
| Backend        | Supabase (BaaS)      | Autenticação, banco de dados, storage, regras de acesso (RLS) |

### 9.2 Mobile — Capacidades Necessárias

- Notificações push (confirmações, promoção na lista de espera, convites, aprovações)
- Deep links (abertura de eventos/comunidades por link externo)
- Compartilhamento nativo (WhatsApp, outros apps)
- Geração e leitura de QR code

### 9.3 Web — Capacidades Necessárias

- Página pública de evento acessível sem login
- Responsivo para mobile browser
- Suporte a deep links para redirecionar ao app quando instalado

### 9.4 Backend

- Autenticação via Supabase Auth (e-mail/senha + OAuth Google e Apple)
- Banco de dados PostgreSQL com Row Level Security (RLS) no lugar de guards customizados
- Lógica de acesso a dados em `src/services/`, consumida pelo Next.js web e futuramente pelo app mobile
- Promoção automática de waitlist gerenciada via Supabase

## 10. Questões em Aberto

Itens que precisam de decisão antes da implementação das respectivas features.

| #   | Questão                                                                  | Impacto                           | Status           |
| --- | ------------------------------------------------------------------------ | --------------------------------- | ---------------- |
| Q1  | REST vs GraphQL para a API? — Supabase client SDK, sem API customizada   | Arquitetura da API e dos clientes | `[decidido]`     |
| Q2  | Estrutura do repositório: monorepo ou repos separados? — monorepo        | Setup inicial do projeto          | `[decidido]`     |
| Q3  | Qual provedor de notificações push? (Firebase, OneSignal, etc.)          | Mobile                            | `[pendente]`     |
| Q4  | Evento de comunidade pode ser visível publicamente (fora da comunidade)? | Regras de visibilidade            | `[em discussão]` |
| Q5  | Preview de evento via link exige algum cadastro para confirmar presença? | Fluxo de conversão                | `[pendente]`     |
| Q6  | Admin pode transferir ownership de comunidade?                           | Regras de governança              | `[pendente]`     |
| Q7  | Múltiplos admins por comunidade são suportados no MVP?                   | Gestão de comunidade              | `[em discussão]` |

## 11. Fora do Escopo

Features previstas para versões futuras. **Não devem ser implementadas no MVP.**

| Feature                                                    | Observação                          |
| ---------------------------------------------------------- | ----------------------------------- |
| Algoritmos de recomendação de comunidades/eventos          | Evolução futura                     |
| Discovery geográfico ou por interesses                     | Evolução futura                     |
| Monetização / eventos pagos / ingressos                    | Evolução futura                     |
| Gamificação / social graph complexo                        | Evolução futura                     |
| Feed/rede social avançada                                  | Evolução futura                     |
| Chat em tempo real dentro do app                           | WhatsApp cobre esse papel           |
| Transmissão ao vivo de eventos                             | Evolução futura                     |
| Calendário externo / sincronização (Google Calendar, etc.) | Evolução futura                     |
| Integração profunda com APIs do WhatsApp/Discord           | Evolução futura                     |
| Sistema de ranking/popularidade                            | Evolução futura                     |
| Registro e discussão de leituras, filmes e séries          | Evolução futura — produto adjacente |

## 12. Histórico de Mudanças

| Data       | Versão | Descrição |
| ---------- | ------ | --------- |
| Abril 2026 | 1.0    | Versão inicial da especificação |
| Maio 2026  | 1.1    | Pivô de arquitetura: NestJS + Prisma → Next.js 15 + Supabase BaaS; pasta `api/` removida do monorepo; `specs/` renomeada para `docs/` |

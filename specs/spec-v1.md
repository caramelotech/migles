# Migles — Spec do Produto

**Gerenciamento de Eventos entre Amigos e Comunidades**

> Versão 1.0 · Abril 2026 · Status: Rascunho Inicial

## 1. Visão Geral do Produto

### 1.1 Descrição

O Migles é uma plataforma multiplataforma (mobile + web) para criação e gerenciamento de eventos entre amigos e comunidades. O produto permite que usuários organizem encontros de forma simples, convidem pessoas do seu círculo social e participem de comunidades com interesses em comum.

O foco inicial é o núcleo de gestão de eventos. Expansões futuras como registro de leituras, filmes e séries com geração de tópicos de discussão estão previstas, mas fora do escopo desta versão.

### 1.2 Resumo do Produto

| Campo           | Detalhe                                                                          |
| --------------- | -------------------------------------------------------------------------------- |
| Nome do produto | Migles                                                                           |
| Plataformas     | Mobile (iOS e Android) + Web                                                     |
| Stack técnica   | React Native (mobile), React (web), Node.js + TypeScript (API)                   |
| Público-alvo    | Pessoas que organizam eventos sociais com amigos e/ou fazem parte de comunidades |
| Fase atual      | Ideação — sem código ou protótipo                                                |
| Time            | Pequeno (2 a 4 pessoas)                                                          |

### 1.3 Problema que Resolve

Organizar eventos informais entre amigos ou dentro de comunidades ainda é fragmentado: convites são feitos via links ou código, que podem ser compartilhados via WhatsApp, ou via nome de usuário, com controle de presença. O Migles une criação de evento, controle de participantes e lista de espera em um único lugar, com integração natural ao WhatsApp para comunicação.

## 2. Usuários e Perfis

### 2.1 Tipos de Usuário

#### Usuário Comum

Qualquer pessoa cadastrada na plataforma. Pode:

- Criar e gerenciar seus próprios eventos
- Convidar amigos para seus eventos
- Participar de eventos de amigos ou comunidades
- Fazer parte de uma ou mais comunidades (ou nenhuma)
- Confirmar ou recusar presença em eventos

#### Admin / Gestor de Comunidade

Usuário com permissões elevadas dentro de uma comunidade específica. Pode:

- Criar e gerenciar eventos vinculados à comunidade
- Aprovar solicitações de entrada na comunidade
- Gerenciar membros da comunidade
- Todas as permissões do Usuário Comum

### 2.2 Autenticação

O cadastro e login serão oferecidos por duas modalidades:

- **Login social:** Google e Apple
- **E-mail e senha:** cadastro tradicional com validação de e-mail

Ambas as modalidades devem estar disponíveis em todas as plataformas. Sessão persistente com renovação automática de token.

## 3. Funcionalidades

### 3.1 Gestão de Eventos

#### Criação de Evento

Um usuário pode criar um evento informando:

- Título e descrição
- Data, horário e local (presencial ou online)
- Limite de participantes (opcional — sem limite por padrão)
- Vinculação a uma comunidade (opcional — apenas admins da comunidade podem fazer isso)
- Visibilidade: privado (só convidados) ou aberto à comunidade

#### Confirmação de Presença (RSVP)

Cada evento suporta RSVP com os seguintes estados para o participante:

- **Confirmado**
- **Recusado**
- **Pendente** (convite recebido, não respondido)

Quando o evento tem limite de vagas:

- Participantes confirmados após o limite entram automaticamente na lista de espera
- Em caso de desistência, o próximo da fila recebe notificação e é promovido automaticamente

#### Convites

O criador do evento pode:

- Convidar usuários da plataforma diretamente (por nome ou contato)
- Gerar link de convite ou QR code para compartilhamento externo
- Compartilhar o evento via WhatsApp (deep link ou link para a web)

### 3.2 Comunidades

#### Criação e Gestão

Qualquer usuário pode criar uma comunidade, tornando-se automaticamente seu admin. A comunidade tem:

- Nome e descrição
- Foto/avatar
- Tipo: pública (qualquer um entra) ou fechada (entrada por aprovação ou convite)

#### Formas de Entrada

Uma comunidade pode combinar diferentes mecanismos de entrada:

- **Link de convite ou QR code:** qualquer pessoa com o link pode solicitar ou entrar diretamente
- **Solicitação + aprovação do admin:** o usuário solicita e o admin aprova ou recusa
- **Comunidade pública:** entrada livre, sem aprovação

O admin define quais mecanismos estão habilitados para aquela comunidade.

#### Eventos de Comunidade

Admins e gestores podem criar eventos vinculados à comunidade. Esses eventos:

- Aparecem no feed de todos os membros
- Podem ter visibilidade restrita a membros ou aberta ao público
- Seguem as mesmas regras de RSVP e lista de espera

### 3.3 Comentários e Interação Social

#### Comentários em Eventos

Cada evento tem uma seção de comentários onde participantes podem interagir:

- Comentários em thread (respostas aninhadas)
- Compartilhar comentário específico via WhatsApp
- Compartilhar o evento completo via WhatsApp

#### Integração com WhatsApp

O WhatsApp é reconhecido como o canal principal de comunicação dos usuários. O app não visa substituí-lo, mas se integra a ele:

- Compartilhamento do evento via WhatsApp (link para a plataforma web)
- Compartilhamento de comentários específicos via deep link
- Convite de pessoas externas via link compartilhável no WhatsApp

## 4. Fluxos Principais

### 4.1 Criar um Evento Pessoal

1. Usuário acessa a tela de criação de evento
2. Preenche título, data, local e opcionalmente limite de vagas
3. Decide se convida pessoas diretamente ou compartilha link
4. Evento é publicado e aparece no perfil do usuário

### 4.2 Criar um Evento de Comunidade

1. Usuário (admin ou gestor) acessa a comunidade
2. Cria evento e vincula à comunidade
3. Evento aparece no feed de membros da comunidade
4. Membros recebem notificação e podem confirmar presença

### 4.3 Entrar em uma Comunidade

1. **Via link/QR code:** usuário acessa o link e entra diretamente (se pública) ou envia solicitação (se fechada)
2. **Via busca:** usuário encontra comunidade pública e solicita entrada
3. **Via convite direto:** admin convida o usuário pelo app

### 4.4 Confirmar Presença em Evento

1. Usuário recebe convite ou vê evento no feed
2. Acessa o evento e confirma presença
3. Se o evento está lotado, entra na lista de espera e recebe notificação caso uma vaga abra

## 5. Plataformas e Partes do Produto

### 5.1 Aplicativo Mobile (React Native)

Versões iOS e Android. É a interface principal para usuários no dia a dia. Deve suportar:

- Notificações push (confirmações, lista de espera, convites)
- Deep links (abertura de eventos ou comunidades por link externo)
- Compartilhamento nativo com WhatsApp e outros apps
- QR code (leitura e geração)

### 5.2 Plataforma Web (React)

Interface acessível pelo navegador. Serve principalmente para:

- Acesso via links compartilhados (preview de evento sem instalar o app)
- Gestão de comunidades e eventos em desktop
- Página pública de evento para usuários não cadastrados visualizarem

### 5.3 API (Node.js + TypeScript)

Backend responsável por toda a lógica de negócio. Deve expor:

- API RESTful (ou GraphQL — a definir) consumida por mobile e web
- Autenticação via JWT + OAuth (Google, Apple)
- Lógica de RSVP, lista de espera e notificações
- Gestão de permissões por comunidade

## 6. Fora do Escopo — Versão Inicial

Os itens abaixo são ideias de expansão previstas, mas não fazem parte do MVP:

- Registro e discussão de leituras (livros)
- Registro e discussão de filmes e séries
- Geração de tópicos de discussão baseados em conteúdo consumido
- Monetização, eventos pagos ou ingressos
- Chat em tempo real dentro do app
- Transmissão ao vivo de eventos

## 7. Próximos Passos

Com o spec inicial definido, os próximos passos recomendados para o time são:

- Definir a arquitetura de dados (modelagem das entidades: usuário, evento, comunidade, RSVP)
- Criar wireframes das telas principais (criação de evento, feed, perfil, comunidade)
- Definir estratégia de notificações (push + in-app)
- Validar fluxo de autenticação e providers OAuth
- Escolher formato de API (REST vs GraphQL) e estrutura do monorepo
- Definir critérios de priorização para o MVP (quais funcionalidades entram primeiro)

---

_Migles — Spec v1.0 · Documento interno · Abril 2026_

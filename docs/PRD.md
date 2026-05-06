# Product Description

Migles é uma plataforma web e mobile para criar, organizar e gerenciar eventos sociais e comunidades. Centraliza criação de eventos, convites, RSVP, controle de vagas e lista de espera, com mecanismos de compartilhamento (links/QR/deep links) e camada básica de comunidades e moderação. O MVP foca no fluxo core: criar evento → convidar → confirmar presença → gerenciar participantes.

# Key features

1. Users should be able to authenticate (email/password + social)
2. Users should be able to create and manage communities
3. Users should be able to create and manage events
4. Users should be able to invite and share events (links/QR)
5. Users should be able to RSVP and use waitlist logic
6. Users should be able to comment and moderate event threads
7. Users should be able to discover events and public previews
8. Users should be able to receive notifications and deep links

# User Stories

## 1. Users should be able to authenticate (email/password + social)

- Como visitante, quero cadastrar com e-mail/senha para acessar a plataforma.
- Como usuário, quero entrar com Google/Apple para login rápido.
- Como usuário, quero sessão persistente por token para manter login.
- Como usuário, quero resetar senha para recuperar acesso.

## 2. Users should be able to create and manage communities

- Como usuário, quero criar comunidade e ser admin automaticamente.
- Como admin, quero configurar comunidade pública/privada e métodos de entrada.
- Como usuário, quero entrar em comunidade pública sem aprovação.
- Como usuário, quero solicitar entrada em comunidade privada para participar.

## 3. Users should be able to create and manage events

- Como organizador, quero criar evento com título, data e local.
- Como organizador, quero definir limite de vagas para controlar participantes.
- Como organizador, quero vincular evento a comunidade (se admin).
- Como organizador, quero adicionar múltiplos organizadores para co-gestão.

## 4. Users should be able to invite and share events (links/QR)

- Como organizador, quero convidar usuários da plataforma por busca.
- Como organizador, quero gerar link de convite compartilhável publicamente.
- Como organizador, quero gerar QR code para facilitar check-ins.
- Como usuário, quero compartilhar evento via WhatsApp com deep link.

## 5. Users should be able to RSVP and use waitlist logic

- Como convidado, quero confirmar presença para reservar vaga.
- Como convidado, quero recusar convite para liberar vaga.
- Como usuário, quero ficar na lista de espera quando evento lotar.
- Como organizador, quero ver e cancelar RSVPs manualmente.

## 6. Users should be able to comment and moderate event threads

- Como participante, quero comentar no evento para discutir detalhes.
- Como participante, quero responder a comentários (threads) para conversa organizada.
- Como organizador/admin, quero remover comentários para moderar conteúdo.
- Como usuário, quero compartilhar um comentário específico via WhatsApp.

## 7. Users should be able to discover events and public previews

- Como visitante, quero ver preview público de evento sem login.
- Como usuário, quero buscar comunidades por nome ou código para descobrir eventos.
- Como membro, quero ver eventos da minha comunidade para planejar participação.

## 8. Users should be able to receive notifications and deep links

- Como participante, quero receber push quando for promovido da lista de espera.
- Como usuário, quero receber notificação de convite recebido.
- Como usuário móvel, quero abrir evento via deep link no app instalado.

# User Journeys

## Feature 1

### Como visitante, quero cadastrar com e-mail/senha para acessar a plataforma.

GIVEN visitante na tela de cadastro
WHEN preenche e-mail, senha e submete o formulário
AND confirma e-mail pelo link recebido
THEN conta é criada
AND usuário é redirecionado ao dashboard inicial

### Como usuário, quero entrar com Google/Apple para login rápido.

GIVEN usuário na tela de login
WHEN clica botão "Entrar com Google" e consente permissões
THEN sessão é criada
AND usuário entra na plataforma sem preencher senha

### Como usuário, quero sessão persistente por token para manter login.

GIVEN usuário já autenticado
WHEN fecha e reabre o app dentro do período do token
THEN sessão é renovada automaticamente
AND usuário permanece logado

### Como usuário, quero resetar senha para recuperar acesso.

GIVEN usuário na tela de login escolhe "Esqueci senha"
WHEN insere e-mail e abre link enviado
AND define nova senha
THEN senha é atualizada
AND usuário consegue entrar com nova senha

## Feature 2

### Como usuário, quero criar comunidade e ser admin automaticamente.

GIVEN usuário autenticado na tela "Criar comunidade"
WHEN preenche nome, tipo e salva
THEN comunidade é criada
AND usuário é marcado como admin

### Como admin, quero configurar comunidade pública/privada e métodos de entrada.

GIVEN admin na página de configurações da comunidade
WHEN ajusta tipo para "privada" e ativa "solicitação"
THEN configurações são salvas
AND novas entradas seguem o mecanismo selecionado

### Como usuário, quero entrar em comunidade pública sem aprovação.

GIVEN comunidade pública encontrada por busca
WHEN usuário clica "Entrar"
THEN usuário é adicionado como membro imediatamente
AND passa a ver eventos da comunidade

### Como usuário, quero solicitar entrada em comunidade privada para participar.

GIVEN comunidade privada
WHEN usuário clica "Solicitar entrada"
THEN pedido fica pendente
AND admin recebe notificação para aprovar

## Feature 3

### Como organizador, quero criar evento com título, data e local.

GIVEN organizador na tela "Novo evento"
WHEN preenche título, data, horário e salva
THEN evento é criado no estado "draft" ou "published" conforme escolha
AND aparece na lista de eventos do organizador

### Como organizador, quero definir limite de vagas para controlar participantes.

GIVEN organizador no formulário de evento
WHEN define limite de vagas e publica evento
THEN sistema aplica limite nas confirmações
AND novas confirmações além do limite entram na waitlist

### Como organizador, quero vincular evento a comunidade (se admin).

GIVEN organizador é admin de uma comunidade
WHEN seleciona comunidade durante criação e publica
THEN evento fica vinculado àquela comunidade
AND só membros (ou conforme visibilidade) podem vê-lo

### Como organizador, quero adicionar múltiplos organizadores para co-gestão.

GIVEN evento criado
WHEN organizador adiciona outro usuário como organizador
THEN novo organizador recebe permissão de gestão
AND aparece na lista de organizadores

## Feature 4

### Como organizador, quero convidar usuários da plataforma por busca.

GIVEN organizador no painel do evento
WHEN busca por nome/e-mail e envia convite
THEN convites são registrados como `pending`
AND os convidados recebem notificação

### Como organizador, quero gerar link de convite compartilhável publicamente.

GIVEN organizador na seção "Compartilhar"
WHEN clica "Gerar link" e copia URL
THEN link é criado com token
AND pode ser compartilhado externamente

### Como organizador, quero gerar QR code para facilitar check-ins.

GIVEN organizador na seção "Compartilhar"
WHEN clica "Gerar QR code"
THEN QR é gerado baseado no link do evento
AND pode ser baixado/compartilhado

### Como usuário, quero compartilhar evento via WhatsApp com deep link.

GIVEN usuário vê evento no app
WHEN clica "Compartilhar" → WhatsApp
THEN mensagem com deep link é aberta
AND receptor abre evento no app ou web

## Feature 5

### Como convidado, quero confirmar presença para reservar vaga.

GIVEN usuário recebeu convite ou acessou evento
WHEN clica "Confirmar presença"
THEN RSVP é marcado como `confirmed`
AND vaga é contabilizada contra o limite

### Como convidado, quero recusar convite para liberar vaga.

GIVEN usuário com RSVP `pending` ou `confirmed`
WHEN clica "Recusar"
THEN RSVP passa a `declined`
AND se era `confirmed`, vaga é liberada e próximo da waitlist é promovido

### Como usuário, quero ficar na lista de espera quando evento lotar.

GIVEN evento atingiu limite de vagas
WHEN usuário tenta confirmar presença
THEN RSVP é marcado como `waitlisted`
AND posição na fila é registrada

### Como organizador, quero ver e cancelar RSVPs manualmente.

GIVEN organizador no painel de participantes
WHEN seleciona participante e clica "Remover RSVP"
THEN RSVP é removido
AND vaga é liberada e próximo da fila promovido automaticamente

## Feature 6

### Como participante, quero comentar no evento para discutir detalhes.

GIVEN participante em página do evento
WHEN escreve e publica comentário
THEN comentário aparece ligado ao evento visível a quem tiver acesso

### Como participante, quero responder a comentários (threads) para conversa organizada.

GIVEN comentário existente
WHEN usuário clica "Responder" e envia resposta
THEN resposta aparece aninhada sob o comentário pai

### Como organizador/admin, quero remover comentários para moderar conteúdo.

GIVEN organizador vendo comentário inadequado
WHEN clica "Remover" e confirma
THEN comentário é excluído
AND ação é registrada no log de moderação

### Como usuário, quero compartilhar um comentário específico via WhatsApp.

GIVEN comentário visível
WHEN usuário clica "Compartilhar comentário" → WhatsApp
THEN link para o comentário é gerado
AND mensagem pré-preenchida abre no WhatsApp

## Feature 7

### Como visitante, quero ver preview público de evento sem login.

GIVEN visitante acessa URL pública do evento
WHEN abre a página web de preview
THEN vê título, data, local e descrição em modo somente leitura

### Como usuário, quero buscar comunidades por nome ou código para descobrir eventos.

GIVEN usuário na tela de busca
WHEN digita nome ou código e submete
THEN comunidades correspondentes são listadas com opção de entrar

### Como membro, quero ver eventos da minha comunidade para planejar participação.

GIVEN usuário é membro de uma comunidade
WHEN visita página da comunidade
THEN vê lista de próximos eventos vinculados a ela

## Feature 8

### Como participante, quero receber push quando for promovido da lista de espera.

GIVEN usuário está `waitlisted` e outra pessoa cancela RSVP
WHEN sistema promove próximo da fila
THEN usuário promovido recebe notificação push e in-app

### Como usuário, quero receber notificação de convite recebido.

GIVEN organizador envia convite
WHEN convite é registrado como `pending`
THEN destinatário recebe notificação push/in-app e e-mail (se habilitado)

### Como usuário móvel, quero abrir evento via deep link no app instalado.

GIVEN usuário clica deep link do evento em dispositivo móvel
WHEN app está instalado
THEN app abre diretamente na página do evento
AND se não autenticado, direciona para login antes de mostrar detalhes privados

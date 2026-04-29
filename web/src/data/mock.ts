import type { Community, CommunityMember, Event, Me } from '../types'

export const ME: Me = {
  name: 'Lucas Ferreira',
  initials: 'LF',
  color: '#9b87f5',
  bio: 'Adora churrascos, trilhas e sessões de cinema com a galera.',
  eventsCount: 12,
  communitiesCount: 3,
}

export const COMMUNITIES: Community[] = [
  { id: 'c1', name: 'Galera do Rolê',  members: 24, color: '#9b87f5', type: 'public'  },
  { id: 'c2', name: 'Trilheiros SP',   members: 47, color: '#f97316', type: 'public'  },
  { id: 'c3', name: 'Cinema e Café',   members: 15, color: '#06b6d4', type: 'private' },
]

export const COMMUNITY_MEMBERS: Record<string, CommunityMember[]> = {
  c1: [
    { name: 'Bruno Almeida',  initials: 'BA', color: '#4ade80', role: 'admin'  },
    { name: 'Lucas Ferreira', initials: 'LF', color: '#9b87f5', role: 'member' },
    { name: 'Ana Lima',       initials: 'AL', color: '#f97316', role: 'member' },
    { name: 'Carla Santos',   initials: 'CS', color: '#06b6d4', role: 'member' },
    { name: 'Davi Rocha',     initials: 'DR', color: '#ec4899', role: 'member' },
    { name: 'Rafael Nunes',   initials: 'RN', color: '#fbbf24', role: 'member' },
    { name: 'Paula Melo',     initials: 'PM', color: '#f43f5e', role: 'member' },
  ],
  c2: [
    { name: 'Mariana Costa',  initials: 'MC', color: '#f97316', role: 'admin'  },
    { name: 'João Pedro',     initials: 'JP', color: '#8b5cf6', role: 'admin'  },
    { name: 'Katia Torres',   initials: 'KT', color: '#ec4899', role: 'member' },
    { name: 'André Braga',    initials: 'AB', color: '#14b8a6', role: 'member' },
    { name: 'Lucas Ferreira', initials: 'LF', color: '#9b87f5', role: 'member' },
  ],
  c3: [
    { name: 'Carla Santos',   initials: 'CS', color: '#06b6d4', role: 'admin'  },
    { name: 'Ricardo Matos',  initials: 'RM', color: '#f59e0b', role: 'member' },
    { name: 'Paula Lima',     initials: 'PL', color: '#a78bfa', role: 'member' },
    { name: 'Lucas Ferreira', initials: 'LF', color: '#9b87f5', role: 'member' },
  ],
}

export const COMMUNITY_DESCRIPTIONS: Record<string, string> = {
  c1: 'Grupo de amigos que se reúne todo mês para rolar juntos. Churrascos, barzinhos, trilhas e tudo que a galera quiser.',
  c2: 'Apaixonados por trilhas e natureza em São Paulo. Saídas semanais em diferentes parques e reservas da região.',
  c3: 'Para os que amam cinema e uma boa conversa. Sessões temáticas, filmes clássicos e debates sobre roteiros.',
}

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Churrasquinho da Galera',
    description: 'Vem pro nosso rolê mensal de churrasco! Vai ter carne, frango, drinks e muito papo bom. Tragam as bebidas de vocês — a carne fica por conta do evento.',
    dateLabel: 'Sab, 10 Mai',
    time: '18:00',
    location: 'Casa do Bruno · Pinheiros, SP',
    capacity: 20,
    rsvpCount: 17,
    waitlistCount: 3,
    myRsvp: 'confirmed',
    community: COMMUNITIES[0],
    organizer: { name: 'Bruno Almeida', initials: 'BA', color: '#4ade80' },
    attendees: [
      { initials: 'BA', color: '#4ade80' },
      { initials: 'LF', color: '#9b87f5' },
      { initials: 'AL', color: '#f97316' },
      { initials: 'CS', color: '#06b6d4' },
      { initials: 'DR', color: '#ec4899' },
      { initials: 'RN', color: '#fbbf24' },
    ],
    comments: [
      {
        id: 'cm1',
        author: 'Ana Lima',
        initials: 'AL',
        color: '#f97316',
        text: 'Alguém pode trazer carvão? Esqueci de comprar 😅',
        time: '2h',
        replies: [
          { id: 'r1', author: 'Bruno Almeida', initials: 'BA', color: '#4ade80', text: 'Já resolvi! Pode ficar tranquila. 🪵', time: '1h' },
        ],
      },
      { id: 'cm2', author: 'Carla Santos', initials: 'CS', color: '#06b6d4', text: 'Vai ter opção vegetariana?', time: '45min', replies: [] },
      { id: 'cm3', author: 'Davi Rocha',   initials: 'DR', color: '#ec4899', text: 'Confirmado! Chego às 18h em ponto. 🔥', time: '20min', replies: [] },
    ],
  },
  {
    id: 'e2',
    title: 'Trilha no Parque Estadual',
    description: 'Trilha de 8km com nível intermediário. Saída às 8h em ponto. Tragam água, protetor solar e um lanche leve.',
    dateLabel: 'Dom, 17 Mai',
    time: '08:00',
    location: 'Parque Estadual da Cantareira, SP',
    capacity: 15,
    rsvpCount: 9,
    waitlistCount: 0,
    myRsvp: 'pending',
    community: COMMUNITIES[1],
    organizer: { name: 'Mariana Costa', initials: 'MC', color: '#f97316' },
    attendees: [
      { initials: 'MC', color: '#f97316' },
      { initials: 'JP', color: '#8b5cf6' },
      { initials: 'KT', color: '#ec4899' },
      { initials: 'AB', color: '#14b8a6' },
    ],
    comments: [],
  },
  {
    id: 'e3',
    title: 'Sessão Nolan — The Prestige',
    description: 'Sessão com pipoca e debate pós-filme. Tragam seus snacks favoritos. Vamos discutir aquele final incrível!',
    dateLabel: 'Sab, 23 Mai',
    time: '19:30',
    location: 'Apt da Carla · Moema, SP',
    capacity: null,
    rsvpCount: 6,
    waitlistCount: 0,
    myRsvp: 'declined',
    community: COMMUNITIES[2],
    organizer: { name: 'Carla Santos', initials: 'CS', color: '#06b6d4' },
    attendees: [
      { initials: 'CS', color: '#06b6d4' },
      { initials: 'RM', color: '#f59e0b' },
      { initials: 'PL', color: '#a78bfa' },
    ],
    comments: [],
  },
]

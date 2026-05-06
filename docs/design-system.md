# Migles — Design System

Documentação do sistema de design.

## Fundamentos

### Filosofia

UI baseada no shadcn/ui com Tailwind CSS 4. Tokens semânticos em CSS custom properties (formato OKLCH), suporte a tema claro e escuro via classe `.dark` no `<html>`. Componentes Radix UI como primitivos de acessibilidade.

## Tokens de Design

Todos os tokens são CSS custom properties definidos em `src/styles.css`.

### Cores - Tema Claro (`:root`)

| Variável                   | Uso                                                 |
| -------------------------- | --------------------------------------------------- |
| `--background`             | Fundo da aplicação (`oklch(0.962 0.008 90)`)        |
| `--foreground`             | Texto principal                                     |
| `--card`                   | Fundo de cards                                      |
| `--card-foreground`        | Texto em cards                                      |
| `--primary`                | Cor primária - amber quente (`oklch(0.68 0.13 65)`) |
| `--primary-foreground`     | Texto sobre primary                                 |
| `--secondary`              | Cor secundária - cinza claro                        |
| `--secondary-foreground`   | Texto sobre secondary                               |
| `--muted`                  | Fundos e elementos sutis                            |
| `--muted-foreground`       | Texto secundário/desabilitado                       |
| `--accent`                 | Hover states e elementos ativos                     |
| `--accent-foreground`      | Texto sobre accent                                  |
| `--destructive`            | Ações destrutivas - vermelho                        |
| `--destructive-foreground` | Texto sobre destructive                             |
| `--border`                 | Bordas padrão                                       |
| `--input`                  | Bordas de inputs                                    |
| `--ring`                   | Focus ring (mesmo valor que `--primary`)            |

### Cores - Tema Escuro (`.dark`)

Mesmas variáveis semânticas com valores ajustados. O `--primary` no dark é `oklch(0.74 0.13 70)` (amber mais claro). Bordas usam alpha: `oklch(1 0 0 / 10%)`.

### Cores de Sidebar

Conjunto separado de tokens para a sidebar, permitindo estilização independente do tema:

| Variável               | Uso                     |
| ---------------------- | ----------------------- |
| `--sidebar`            | Fundo da sidebar        |
| `--sidebar-foreground` | Texto na sidebar        |
| `--sidebar-primary`    | Cor primária na sidebar |
| `--sidebar-accent`     | Hover/active na sidebar |
| `--sidebar-border`     | Bordas na sidebar       |
| `--sidebar-ring`       | Focus ring na sidebar   |

### Cores Semânticas de Domínio

Aplicadas diretamente via classes Tailwind (não como tokens CSS):

| Contexto        | Fundo               | Texto                   |
| --------------- | ------------------- | ----------------------- |
| RSVP confirmado | `bg-emerald-500/15` | `text-emerald-600`      |
| RSVP pendente   | `bg-amber-500/15`   | `text-amber-600`        |
| RSVP recusado   | `bg-red-500/15`     | `text-red-600`          |
| RSVP na fila    | `bg-muted`          | `text-muted-foreground` |

### Cores de Comunidade

Geradas dinamicamente via hash do ID da comunidade (`dotColor()` em `app-shell.tsx`). Paleta fixa de 6 cores Tailwind:

`primary` · `emerald-500` · `sky-500` · `rose-500` · `violet-500` · `amber-500`

## Border Radius

Sistema escalonado a partir de `--radius: 0.5rem`:

| Variável       | Valor      | Uso                  |
| -------------- | ---------- | -------------------- |
| `--radius-sm`  | `0.25rem`  | Elementos pequenos   |
| `--radius-md`  | `0.375rem` | Badges, chips        |
| `--radius-lg`  | `0.5rem`   | Padrão (base)        |
| `--radius-xl`  | `0.625rem` | Inputs               |
| `--radius-2xl` | `0.75rem`  | Cards (`rounded-xl`) |
| `--radius-4xl` | `1rem`     | Modais, drawers      |

## Tipografia

System fonts padrão do navegador via Tailwind. Sem fontes customizadas importadas.

| Papel            | Classe Tailwind                                  |
| ---------------- | ------------------------------------------------ |
| Título de página | `text-2xl font-bold`                             |
| Título de card   | `text-base font-semibold`                        |
| Corpo            | `text-sm`                                        |
| Texto secundário | `text-sm text-muted-foreground`                  |
| Caps label       | `text-xs font-semibold tracking-wider uppercase` |

## Componentes

Todos os componentes são do shadcn/ui (Radix UI como primitivo).

### Button

6 variantes via CVA:

| Variante      | Uso                               |
| ------------- | --------------------------------- |
| `default`     | CTA principal (fundo `primary`)   |
| `destructive` | Ações destrutivas                 |
| `outline`     | Borda visível, fundo transparente |
| `secondary`   | Ação secundária                   |
| `ghost`       | Ação terciária, sem fundo         |
| `link`        | Texto clicável como link          |

4 tamanhos: `default` · `sm` · `lg` · `icon`

### Card

`rounded-xl border bg-card shadow`. Usado para eventos no feed e itens de comunidade. Hover clicável: `hover:bg-accent/30 transition-colors`.

### Avatar

`h-10 w-10 rounded-full overflow-hidden`. Fallback com iniciais geradas via `initials()`.

### Badge

4 variantes: `default` · `secondary` · `destructive` · `outline`. Usado para status de RSVP e roles.

### Componentes de entrada

`Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Slider` - todos shadcn/ui padrão.

### Overlays

`Dialog`, `Drawer`, `AlertDialog`, `Popover` - primitivos Radix com estilo shadcn.

## Layout

### Desktop (>= `md`, 768px)

```
┌──────────────────┬────────────────────────────────────┐
│    Sidebar       │          Main Content              │
│    w-60 (md)     │          max-w-4xl                 │
│    w-64 (lg)     │          px-4 py-8                 │
│    sticky        │                                    │
└──────────────────┴────────────────────────────────────┘
```

Sidebar: `sticky top-0 h-screen border-r border-border`

### Mobile (< `md`, 768px)

```
┌────────────────────────────────────┐
│           Main Content             │
│           px-4 py-6 pb-24          │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│   Bottom Nav (fixed, z-40)         │
│   grid-cols-4 · border-t           │
│   bg-background/95 backdrop-blur   │
└────────────────────────────────────┘
```

`pb-24` no main para não sobrepor a bottom nav. Bottom nav: 4 colunas (Início, Criar, Perfil, Tema).

### Sidebar - Estrutura interna

- **Header** (`h-14 px-4`): logo "M" com `bg-primary h-7 w-7 rounded-lg`
- **Nav** (`px-2`): itens com `rounded-lg px-3 py-2`, ativo com `bg-accent text-primary`
- **Comunidades** (`flex-1 overflow-y-auto`): lista com dot colorido por comunidade
- **Footer** (`p-3 border-t`): botão de tema + logout

## Animações e Transições

| Efeito             | Implementação                                                |
| ------------------ | ------------------------------------------------------------ |
| Loading spinner    | `animate-spin rounded-full border-b-2 border-primary`        |
| Hover em cards     | `hover:bg-accent/30 transition-colors`                       |
| Hover em nav items | `hover:bg-accent/50 hover:text-foreground transition-colors` |
| Eventos passados   | `opacity-60`                                                 |
| Bottom nav blur    | `backdrop-blur`                                              |
| Focus visible      | `focus-visible:ring-1 focus-visible:ring-ring`               |

## Telas

| Tela               | Rota                         | Acesso      |
| ------------------ | ---------------------------- | ----------- |
| Login / Cadastro   | `/login`                     | Público     |
| Convite por link   | `/i/[code]`                  | Público     |
| Feed de eventos    | `/events`                    | Autenticado |
| Detalhe do evento  | `/events/[eventId]`          | Autenticado |
| Criar evento       | `/events/new`                | Autenticado |
| Editar evento      | `/events/[eventId]/edit`     | Autenticado |
| Comunidades        | `/communities`               | Autenticado |
| Detalhe comunidade | `/communities/[communityId]` | Autenticado |
| Perfil             | `/profile`                   | Autenticado |

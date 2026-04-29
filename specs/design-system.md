# Migles — Design System

> Documentação do sistema de design do Migles, derivado do protótipo criado no Claude Design.

## Fundamentos

### Filosofia

O DS do Migles é **caloroso, social e espaçado**. As referências são Luma e Partiful: cards generosos, tipografia serif nos títulos e espaço para respirar. O sistema suporta dois temas — escuro (padrão) e claro — com troca fluida via token swap.

---

## Tokens de Design

### Paleta — Tema Escuro (padrão)

| Token         | Valor                    | Uso                               |
| ------------- | ------------------------ | --------------------------------- |
| `bg`          | `#0d0d11`                | Fundo da aplicação                |
| `s1`          | `#141418`                | Cards, painéis                    |
| `s2`          | `#1b1b22`                | Inputs, áreas secundárias         |
| `s3`          | `#24242d`                | Fundo de inputs disabled, barras  |
| `border`      | `rgba(255,255,255,0.07)` | Bordas padrão                     |
| `borderH`     | `rgba(255,255,255,0.13)` | Bordas em hover                   |
| `accent`      | `#9b87f5`                | Violet — cor primária, CTA, links |
| `accentDim`   | `rgba(155,135,245,0.13)` | Fundo de elementos accent         |
| `accentLight` | `#c4b5fd`                | Texto sobre fundo accent          |
| `text`        | `#f4f2fc`                | Texto principal                   |
| `text2`       | `#9590b0`                | Texto secundário                  |
| `text3`       | `#5a5575`                | Labels, placeholders, metadados   |
| `green`       | `#4ade80`                | Status confirmado, sucesso        |
| `greenDim`    | `rgba(74,222,128,0.12)`  | Fundo de status confirmado        |
| `red`         | `#f87171`                | Status recusado, erro, danger     |
| `redDim`      | `rgba(248,113,113,0.11)` | Fundo de status recusado          |
| `amber`       | `#fbbf24`                | Status pendente, aviso            |
| `amberDim`    | `rgba(251,191,36,0.11)`  | Fundo de status pendente          |

### Paleta — Tema Claro

| Token         | Valor                   |
| ------------- | ----------------------- |
| `bg`          | `#f5f4f0`               |
| `s1`          | `#ffffff`               |
| `s2`          | `#edeaf8`               |
| `s3`          | `#e0dcf2`               |
| `border`      | `rgba(100,90,160,0.11)` |
| `borderH`     | `rgba(100,90,160,0.2)`  |
| `accent`      | `#7055e8`               |
| `accentDim`   | `rgba(112,85,232,0.1)`  |
| `accentLight` | `#5a44cc`               |
| `text`        | `#0f0d1a`               |
| `text2`       | `#3d3560`               |
| `text3`       | `#7a72a0`               |
| `green`       | `#15803d`               |
| `greenDim`    | `rgba(21,128,61,0.1)`   |
| `red`         | `#b91c1c`               |
| `redDim`      | `rgba(185,28,28,0.08)`  |
| `amber`       | `#b45309`               |
| `amberDim`    | `rgba(180,83,9,0.09)`   |

### Cores de comunidade

Cada comunidade tem uma cor própria usada nos cards, avatares e chips. As cores seguem o padrão de saturação alta para destacar no fundo escuro/claro. Ex: `#9b87f5` (violet), `#f97316` (orange), `#06b6d4` (cyan).

O padrão de opacidade usado: `cor + '14'` = 8% (fundo), `cor + '28'` = 16% (borda), `cor + '20'` = 12.5% (avatar bg), `cor + '38'` = 22% (avatar border).

---

## Tipografia

| Família              | Uso                                | Tamanhos |
| -------------------- | ---------------------------------- | -------- |
| **DM Sans**          | Corpo, labels, botões, UI geral    | 10–16px  |
| **DM Serif Display** | Títulos de eventos, saudação, hero | 18–36px  |

### Escala tipográfica

| Papel                 | Família          | Tamanho | Peso |
| --------------------- | ---------------- | ------- | ---- |
| Título de página      | DM Serif Display | 28–36px | 400  |
| Título de card evento | DM Serif Display | 17–22px | 400  |
| Corpo                 | DM Sans          | 14–15px | 400  |
| Label de seção (caps) | DM Sans          | 11px    | 700  |
| Metadado              | DM Sans          | 12–13px | 400  |
| Label de input        | DM Sans          | 13px    | 500  |
| Botão                 | DM Sans          | 12–15px | 500  |

---

## Espaçamento

O sistema usa espaçamento generoso, inspirado em Luma.

| Token   | Valor | Uso típico                     |
| ------- | ----- | ------------------------------ |
| 4px     | —     | Gap mínimo entre ícone e texto |
| 6px     | —     | Gap em pills, inline elements  |
| 8px     | —     | Gap padrão em listas           |
| 10px    | —     | Padding interno de chips       |
| 12px    | —     | Padding de botão sm, gap médio |
| 14px    | —     | Padding de inputs              |
| 16px    | —     | Padding de card compacto       |
| 18px    | —     | Padding padrão de Card         |
| 20px    | —     | Gap entre seções               |
| 24px    | —     | Padding horizontal de página   |
| 28–32px | —     | Padding top de página          |

---

## Border Radius

| Elemento           | Raio |
| ------------------ | ---- |
| Card               | 14px |
| Community hero     | 16px |
| Botão sm           | 8px  |
| Botão md           | 10px |
| Botão lg           | 11px |
| Input              | 10px |
| Tab item           | 9px  |
| Tab container      | 12px |
| Pill (RSVP, badge) | 20px |
| Avatar             | 50%  |
| Community icon md  | 10px |
| Community icon lg  | 14px |
| Logo               | 9px  |

---

## Componentes

### Button

Cinco variantes:

| Variante    | Fundo       | Cor do texto  | Uso                           |
| ----------- | ----------- | ------------- | ----------------------------- |
| `primary`   | `accent`    | #fff          | CTA principal                 |
| `secondary` | `accentDim` | `accentLight` | CTA secundário                |
| `ghost`     | transparent | `text2`       | Ações terciárias              |
| `danger`    | `redDim`    | `red`         | Ações destrutivas             |
| `success`   | `greenDim`  | `green`       | Confirmação / estado positivo |

Três tamanhos: `sm` (30px h), `md` (38px h), `lg` (44px h).

Comportamento hover: `opacity: 0.85` + `translateY(-1px)`.

---

### Card

Fundo `s1`, borda `border`, `border-radius: 14px`, `padding: 18px`. Em hover (quando clicável): fundo muda para `s2`, borda para `borderH`, sobe 1px.

---

### Avatar

Círculo com fundo `cor + '20'`, borda `cor + '38'`, iniciais em `cor`. Tamanho padrão 36px. Variações: 22px (listas), 26px (replies), 32px (comment input), 38px (member cards), 44px (organizer), 68px (perfil).

---

### RsvpPill

Badge inline com dot colorido + label. Mapeamento:

| Status       | Cor    | Label      |
| ------------ | ------ | ---------- |
| `confirmed`  | green  | Confirmado |
| `declined`   | red    | Recusado   |
| `pending`    | amber  | Pendente   |
| `waitlisted` | accent | Na fila    |

---

### DateChip

Mini calendário: fundo `cor + '14'`, borda `cor + '28'`. Exibe mês (caps, 10px), dia (22px, DM Serif), dia da semana (10px, muted).

---

### Field

Input/textarea com label opcional, hint e estado de erro. Fundo `s2` (ou `s3` se disabled). Borda muda para `rgba(248,113,113,0.45)` em erro.

---

### SectionLabel

Texto em caps, `text3`, `font-weight: 700`, `letter-spacing: 0.08em`, `font-size: 11px`.

---

### ThemeToggle

Botão de alternância claro/escuro. Versão full (sidebar desktop): ícone + texto. Versão compacta (bottom nav mobile): só ícone, 34×34px.

---

## Layout

### Desktop (≥768px)

```
┌──────────────┬────────────────────────────────┐
│   Sidebar    │         Main Content           │
│   220px      │         max-width: 680–720px   │
│   sticky     │         padding: 28–32px 24px  │
└──────────────┴────────────────────────────────┘
```

### Mobile (<768px)

```
┌────────────────────────────────┐
│         Main Content           │
│         padding-bottom: 72px   │
└────────────────────────────────┘
┌────────────────────────────────┐
│     Bottom Nav (fixed, 62px)   │
└────────────────────────────────┘
```

---

## Animações

| Classe      | Keyframe                        | Duração |
| ----------- | ------------------------------- | ------- |
| `.fade-up`  | opacity 0→1 + translateY 10px→0 | 220ms   |
| `.fade-in`  | opacity 0→1                     | 180ms   |
| `.scale-in` | opacity 0→1 + scale 0.95→1      | 200ms   |

Transições de cor/fundo em componentes: `0.15–0.25s ease`.

---

## Telas

| Tela              | Rota                  | Acesso      |
| ----------------- | --------------------- | ----------- |
| Home (feed)       | `/`                   | Autenticado |
| Detalhe do evento | `/events/:id`         | Autenticado |
| Criar evento      | `/events/new`         | Autenticado |
| Perfil            | `/profile`            | Autenticado |
| Comunidade        | `/communities/:id`    | Autenticado |
| Preview público   | `/events/:id/preview` | Público     |

---

## Logo

SVG 32×32, `rx="9"`, fundo `#9b87f5`. Path: duas linhas convergindo em M — representa encontro/conexão.

```
M7 23V10.5l9 7.5 9-7.5V23
```

export type Theme = {
  bg: string
  s1: string
  s2: string
  s3: string
  border: string
  borderH: string
  accent: string
  accentDim: string
  accentLight: string
  text: string
  text2: string
  text3: string
  green: string
  greenDim: string
  red: string
  redDim: string
  amber: string
  amberDim: string
  isDark: boolean
}

export const DARK_THEME: Theme = {
  bg:          '#0d0d11',
  s1:          '#141418',
  s2:          '#1b1b22',
  s3:          '#24242d',
  border:      'rgba(255,255,255,0.07)',
  borderH:     'rgba(255,255,255,0.13)',
  accent:      '#9b87f5',
  accentDim:   'rgba(155,135,245,0.13)',
  accentLight: '#c4b5fd',
  text:        '#f4f2fc',
  text2:       '#9590b0',
  text3:       '#5a5575',
  green:       '#4ade80',
  greenDim:    'rgba(74,222,128,0.12)',
  red:         '#f87171',
  redDim:      'rgba(248,113,113,0.11)',
  amber:       '#fbbf24',
  amberDim:    'rgba(251,191,36,0.11)',
  isDark:      true,
}

export const LIGHT_THEME: Theme = {
  bg:          '#f5f4f0',
  s1:          '#ffffff',
  s2:          '#edeaf8',
  s3:          '#e0dcf2',
  border:      'rgba(100,90,160,0.11)',
  borderH:     'rgba(100,90,160,0.2)',
  accent:      '#7055e8',
  accentDim:   'rgba(112,85,232,0.1)',
  accentLight: '#5a44cc',
  text:        '#0f0d1a',
  text2:       '#3d3560',
  text3:       '#7a72a0',
  green:       '#15803d',
  greenDim:    'rgba(21,128,61,0.1)',
  red:         '#b91c1c',
  redDim:      'rgba(185,28,28,0.08)',
  amber:       '#b45309',
  amberDim:    'rgba(180,83,9,0.09)',
  isDark:      false,
}

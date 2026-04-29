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
  bg: '#111110',
  s1: '#1c1b19',
  s2: '#242320',
  s3: '#2e2c29',
  border: 'rgba(255,255,255,0.07)',
  borderH: 'rgba(255,255,255,0.12)',
  accent: '#f97316',
  accentDim: 'rgba(249,115,22,0.14)',
  accentLight: '#fdba74',
  text: '#f0ede8',
  text2: '#a8a39e',
  text3: '#5e5a55',
  green: '#4ade80',
  greenDim: 'rgba(74,222,128,0.12)',
  red: '#f87171',
  redDim: 'rgba(248,113,113,0.11)',
  amber: '#fbbf24',
  amberDim: 'rgba(251,191,36,0.11)',
  isDark: true,
}

export const LIGHT_THEME: Theme = {
  bg: '#f5f4f0',
  s1: '#ffffff',
  s2: '#f0ebe3',
  s3: '#e8dfd4',
  border: 'rgba(120,80,20,0.1)',
  borderH: 'rgba(120,80,20,0.18)',
  accent: '#ea6c0a',
  accentDim: 'rgba(234,108,10,0.1)',
  accentLight: '#c45608',
  text: '#1a1510',
  text2: '#3a3530',
  text3: '#7a7470',
  green: '#15803d',
  greenDim: 'rgba(21,128,61,0.1)',
  red: '#b91c1c',
  redDim: 'rgba(185,28,28,0.08)',
  amber: '#b45309',
  amberDim: 'rgba(180,83,9,0.09)',
  isDark: false,
}

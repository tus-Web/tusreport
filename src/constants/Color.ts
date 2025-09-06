// カラーシステムの定義
export const colors = {
  // 背景色（現在のまま）
  background: {
    primary: '#ffffff',
    primaryDark: '#0a0a0a',
    card: '#ffffff',
    muted: 'hsl(210 40% 96.1%)',
    overlay: 'rgba(0, 0, 0, 0.1)',
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
  },
  
  // アクセントカラー（緑）
  accent: {
    primary: '#10B981', // emerald-500
    secondary: '#059669', // emerald-600
    light: '#6EE7B7', // emerald-300
    dark: '#047857', // emerald-700
    subtle: '#D1FAE5', // emerald-100
    // 既存のグラデーション色も含める
    legacy: {
      primary: '#667eea',
      secondary: '#764ba2',
    },
  },
  
  // タイトル（白）
  title: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB', // gray-50
    shadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  
  // テキスト（黒）
  text: {
    primary: '#333333',
    secondary: '#555555',
    muted: '#666666',
    light: '#999999',
    inverse: '#FFFFFF',
    error: '#cc0000',
  },
  
  // サブテキスト（薄い黒）
  subtext: {
    primary: '#6B7280', // gray-500
    secondary: '#9CA3AF', // gray-400
    light: '#D1D5DB', // gray-300
    transparent: 'rgba(255, 255, 255, 0.9)',
  },
  
  // ボーダー・インプット
  border: {
    primary: '#dddddd',
    focus: '#667eea',
    accent: '#10B981',
  },
  
  // 状態カラー
  status: {
    success: '#10B981', // emerald-500
    warning: '#F59E0B', // amber-500
    error: {
      background: '#fee',
      text: '#c00',
      primary: '#EF4444', // red-500
    },
    info: '#3B82F6', // blue-500
  },
  
  // シャドウ・エフェクト
  shadow: {
    card: '0 20px 60px rgba(0, 0, 0, 0.3)',
    hover: '0 8px 25px rgba(0, 0, 0, 0.3)',
    button: '0 5px 15px rgba(102, 126, 234, 0.3)',
    focus: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  },
} as const;

// CSS変数として使用するためのマッピング
export const cssVariables = {
  '--color-accent-primary': colors.accent.primary,
  '--color-accent-secondary': colors.accent.secondary,
  '--color-accent-light': colors.accent.light,
  '--color-accent-dark': colors.accent.dark,
  '--color-accent-subtle': colors.accent.subtle,
  '--color-title-primary': colors.title.primary,
  '--color-title-secondary': colors.title.secondary,
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-inverse': colors.text.inverse,
  '--color-subtext-primary': colors.subtext.primary,
  '--color-subtext-secondary': colors.subtext.secondary,
  '--color-subtext-light': colors.subtext.light,
  '--color-background-primary': colors.background.primary,
  '--color-background-gradient': colors.background.gradient.primary,
  '--color-shadow-card': colors.shadow.card,
  '--color-shadow-hover': colors.shadow.hover,
  '--color-shadow-button': colors.shadow.button,
} as const;

// CSS-in-JSスタイル用のヘルパー関数
export const createStyles = {
  // 基本的なページレイアウト
  page: {
    backgroundColor: colors.background.primary,
    background: colors.background.gradient.primary,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  
  // カードスタイル
  card: {
    backgroundColor: colors.background.card,
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: colors.shadow.card,
  },
  
  // タイトルスタイル
  title: {
    primary: {
      color: colors.title.primary,
      textShadow: colors.title.shadow,
      fontSize: '3rem',
      fontWeight: 'bold',
    },
    secondary: {
      color: colors.text.primary,
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center' as const,
    },
  },
  
  // テキストスタイル
  text: {
    primary: { color: colors.text.primary },
    secondary: { color: colors.text.secondary },
    muted: { color: colors.text.muted },
    inverse: { color: colors.text.inverse },
    error: { 
      color: colors.status.error.text,
      backgroundColor: colors.status.error.background,
    },
  },
  
  // ボタンスタイル
  button: {
    primary: {
      background: colors.background.gradient.primary,
      color: colors.title.primary,
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 2rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    accent: {
      background: colors.background.gradient.secondary,
      color: colors.title.primary,
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 2rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
  },
  
  // インプットスタイル
  input: {
    primary: {
      padding: '0.75rem',
      border: `1px solid ${colors.border.primary}`,
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'border-color 0.3s',
    },
    focus: {
      outline: 'none',
      borderColor: colors.border.focus,
      boxShadow: colors.shadow.focus,
    },
  },
  
  // リンクスタイル
  link: {
    primary: {
      color: colors.accent.legacy.primary,
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s',
    },
  },
} as const;

// Tailwindクラス用のヘルパー関数
export const colorClasses = {
  // 背景クラス
  background: {
    primary: 'bg-background',
    secondary: 'bg-card',
    muted: 'bg-muted',
  },
  
  // アクセントクラス
  accent: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    text: 'text-emerald-500',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500',
  },
  
  // タイトルクラス
  title: {
    primary: 'text-white',
    secondary: 'text-gray-50',
  },
  
  // テキストクラス
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    inverse: 'text-white',
  },
  
  // サブテキストクラス
  subtext: {
    primary: 'text-gray-500',
    secondary: 'text-gray-400',
    light: 'text-gray-300',
  },
} as const;

// 型定義
export type ColorKey = keyof typeof colors;
export type AccentColorKey = keyof typeof colors.accent;
export type TextColorKey = keyof typeof colors.text;
export type SubtextColorKey = keyof typeof colors.subtext;
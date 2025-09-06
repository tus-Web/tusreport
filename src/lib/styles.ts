import { colors, createStyles } from '@/constants/Color';

// CSS-in-JSスタイルをCSSモジュールのクラス名として使用するためのヘルパー
export const getStylesForCSS = () => {
  return {
    // ページスタイル
    page: `
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: ${colors.background.gradient.primary};
    `,
    
    // メインコンテンツ
    main: `
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    `,
    
    // カードスタイル
    card: `
      background: ${colors.background.card};
      border-radius: 12px;
      padding: 2rem;
      box-shadow: ${colors.shadow.card};
    `,
    
    // タイトル
    title: `
      font-size: 3rem;
      font-weight: bold;
      color: ${colors.title.primary};
      margin-bottom: 0.5rem;
      text-shadow: ${colors.title.shadow};
    `,
    
    titleSecondary: `
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2rem;
      color: ${colors.text.primary};
    `,
    
    // サブタイトル
    subtitle: `
      font-size: 1.2rem;
      color: ${colors.subtext.transparent};
    `,
    
    // テキスト
    textPrimary: `color: ${colors.text.primary};`,
    textSecondary: `color: ${colors.text.secondary};`,
    textMuted: `color: ${colors.text.muted};`,
    textInverse: `color: ${colors.text.inverse};`,
    
    // ボタン
    button: `
      padding: 0.75rem 2rem;
      background: ${colors.background.gradient.primary};
      color: ${colors.title.primary};
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    `,
    
    buttonHover: `
      transform: translateY(-2px);
      box-shadow: ${colors.shadow.button};
    `,
    
    buttonAccent: `
      background: ${colors.background.gradient.secondary};
      color: ${colors.title.primary};
    `,
    
    // インプット
    input: `
      padding: 0.75rem;
      border: 1px solid ${colors.border.primary};
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    `,
    
    inputFocus: `
      outline: none;
      border-color: ${colors.border.focus};
      box-shadow: ${colors.shadow.focus};
    `,
    
    // エラー
    error: `
      background-color: ${colors.status.error.background};
      color: ${colors.status.error.text};
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      text-align: center;
    `,
    
    // リンク
    link: `
      color: ${colors.accent.legacy.primary};
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    `,
    
    linkHover: `
      color: ${colors.accent.legacy.secondary};
      text-decoration: underline;
    `,
  };
};

// CSS変数を生成する関数
export const generateCSSVariables = () => {
  return `
    :root {
      /* カラー変数 */
      --color-background-primary: ${colors.background.primary};
      --color-background-card: ${colors.background.card};
      --color-background-gradient: ${colors.background.gradient.primary};
      --color-background-gradient-secondary: ${colors.background.gradient.secondary};
      
      --color-accent-primary: ${colors.accent.primary};
      --color-accent-secondary: ${colors.accent.secondary};
      --color-accent-legacy-primary: ${colors.accent.legacy.primary};
      --color-accent-legacy-secondary: ${colors.accent.legacy.secondary};
      
      --color-title-primary: ${colors.title.primary};
      --color-title-shadow: ${colors.title.shadow};
      
      --color-text-primary: ${colors.text.primary};
      --color-text-secondary: ${colors.text.secondary};
      --color-text-muted: ${colors.text.muted};
      --color-text-inverse: ${colors.text.inverse};
      --color-text-error: ${colors.status.error.text};
      
      --color-subtext-primary: ${colors.subtext.primary};
      --color-subtext-transparent: ${colors.subtext.transparent};
      
      --color-border-primary: ${colors.border.primary};
      --color-border-focus: ${colors.border.focus};
      
      --color-error-bg: ${colors.status.error.background};
      
      /* シャドウ変数 */
      --shadow-card: ${colors.shadow.card};
      --shadow-hover: ${colors.shadow.hover};
      --shadow-button: ${colors.shadow.button};
      --shadow-focus: ${colors.shadow.focus};
    }
  `;
};

export { colors, createStyles };

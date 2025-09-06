# カラーシステムの使用方法

このプロジェクトでは、一元化されたカラーシステムを使用してCSSのベタ書きを避けています。

## 概要

- **Color.ts**: 全てのカラー定数を定義
- **globals.css**: CSS変数として定義
- **各CSSモジュール**: CSS変数を使用してカラーを参照

## Color.tsの構造

### カラーカテゴリ

- `background`: 背景色（現在のまま）
- `accent`: アクセントカラー（緑系）
- `title`: タイトル用（白）
- `text`: テキスト用（黒）
- `subtext`: サブテキスト用（薄い黒）

### 使用例

```typescript
import { colors } from '@/constants/Color';

// 直接使用
const titleStyle = {
  color: colors.title.primary,
  background: colors.background.gradient.primary,
};

// CSS-in-JSヘルパー使用
import { createStyles } from '@/constants/Color';
const buttonStyle = createStyles.button.primary;
```

## CSSでの使用方法

### CSS変数の使用

```css
.example {
  color: var(--color-text-primary);
  background: var(--color-background-gradient);
  box-shadow: var(--shadow-card);
}
```

### 利用可能なCSS変数

#### カラー変数
- `--color-background-primary`: メイン背景色
- `--color-background-gradient`: グラデーション背景
- `--color-accent-primary`: メインアクセントカラー（緑）
- `--color-title-primary`: タイトルカラー（白）
- `--color-text-primary`: メインテキストカラー（黒）
- `--color-subtext-primary`: サブテキストカラー（薄い黒）

#### シャドウ変数
- `--shadow-card`: カード用シャドウ
- `--shadow-button`: ボタンホバー用シャドウ
- `--shadow-focus`: フォーカス用シャドウ

## コンポーネント化されたカラープロバイダー

動的なカラー変更が必要な場合は、`ColorProvider`を使用できます：

```tsx
import { ColorProvider } from '@/components/ui/color-provider';

function App() {
  return (
    <ColorProvider customAccent="#10B981">
      {/* アプリケーション */}
    </ColorProvider>
  );
}
```

## メリット

1. **一元管理**: 全てのカラーが一箇所で管理される
2. **保守性**: カラー変更時は一箇所を修正するだけ
3. **一貫性**: プロジェクト全体で統一されたカラーパレット
4. **テーマ対応**: ダークモード等のテーマ切り替えが容易
5. **型安全性**: TypeScriptによる型チェック

## 従来の問題点を解決

❌ **ベタ書き（修正前）**
```css
.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}
```

✅ **変数使用（修正後）**
```css
.button {
  background: var(--color-background-gradient);
  color: var(--color-title-primary);
}
```

これにより、カラーの変更が容易になり、保守性が向上しています。

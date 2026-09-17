# デザインシステム: 木彫りと骨董絵本(パターンB)

StoryViewer / Review / App の見た目刷新のためのデザイントークン定義。
このドキュメントの内容に沿って、ステップ3でCSSを実装する。**このファイル自体はまだ実装ではなく仕様書。**

コンセプト: タイ寺院の木彫り装飾(ラーイクルー)と、古い革装丁の民話集をイメージした、重厚だが温かみのある「古い本を開く」体験。

> **注記(2026-09-17)**: StoryViewerを画像オーバーレイ方式のレイアウトに変更したのに伴い、以下の記述は実装と異なる過去のものになっている。
> - `.story-viewer__image`(挿絵枠)は`.story-viewer__stage` / `.story-viewer__stage-image`に置き換わった
> - `.story-viewer__page-count`(しおりタブ、`clip-path`による三角の切込み)は廃止し、ナビ内のシンプルなインラインテキスト表示に変更した
>
> 詳細はCLAUDE.md「8. StoryViewerのオーバーレイレイアウト」を参照。このファイルの他の記述(2カラムgridや画像アスペクト比4:3など)もPR #7時点で既に実装と乖離している箇所があり、本ドキュメントは初期設計時点の記録として残している。

---

## 1. カラートークン

既存の `App.css` の `--color-*` 命名規則を踏襲する。`:root` に定義する想定。

```css
:root {
  /* 背景・面 */
  --color-bg: #e8dcc0;              /* 古紙(ページ全体の背景) */
  --color-surface: #f3e9d2;         /* 羊皮紙風(カード・本体の面) */
  --color-surface-alt: #ecdfc0;     /* 羊皮紙よりわずかに濃い面(本文ブロックの背景など) */
  --color-surface-raised: #f8f1de;  /* 最前面の面(モーダルカードなど、一番明るい層) */

  /* テキスト */
  --color-text: #3e2723;            /* 濃い木の色(日本語本文のメイン) */
  --color-text-thai: #86633c;       /* タイ語本文(琥珀色寄りの茶褐色。JP本文・漆塗りアクセントと見分けがつく暖色) */
  --color-muted: #8a7358;           /* 補助テキスト(読み方、ページ数、キャプション) */

  /* アクセント */
  --color-accent: #6b4226;          /* チーク材(見出し・キー要素) */
  --color-accent-dark: #4e2f1a;     /* アクセントのホバー/濃い版 */
  --color-lacquer: #8c2f1b;         /* 漆塗り(強調・エラー/警告・単語タップの枠線) */
  --color-brass: #a87c3f;           /* 真鍮(装飾線・フォーカスリング・しおりタブ) */

  /* 副アクセント(革装丁の差し色) */
  --color-secondary: #4b5d3f;       /* 深緑(トグルボタンなど、アクセントと対になる要素) */
  --color-secondary-dark: #37452e;

  /* 罫線・ハイライト */
  --color-border: #bfae8a;          /* 罫線・淡い影 */
  --color-highlight: #e8c77a;       /* 単語タップの背景ハイライト(真鍮を薄めた色) */

  /* 機能色 */
  --color-error: #8c2f1b;           /* エラー表示(漆塗り色を流用。音声再生エラーなど) */
}
```

**方針:** オレンジ×クリームの単純な2色構成から脱却し、木・革・漆・真鍮という4系統の暖色を役割ごとに使い分ける。緑(secondary)は装飾の一色としてのみ使い、寒色でバランスを取る目的では使わない(単純な配色理論のグラデーションに寄せないため)。

**補足(`--color-text-thai`の調整経緯):** 当初案の`#7a3b1f`は`--color-lacquer`(`#8c2f1b`)とのコントラスト比が1.03しかなく、実際に並べて確認したところ「本文」と「強調」の区別が視覚的につかなかったため、`#86633c`に変更した(漆塗りとのコントラスト比1.52、背景とのコントラスト比4.50に改善)。

---

## 2. フォントスケール

### 読み込み方法

`index.html` の `<head>` に以下を追加する(Google Fonts、`font-display: swap` 指定):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&family=Chonburi&family=Kiwi+Maru:wght@400;500&family=Mitr:wght@400;500;600&display=swap"
  rel="stylesheet"
>
```

### フォントファミリー変数

```css
:root {
  --font-heading-jp: 'Klee One', serif;      /* 日本語見出し(手描き風の丸み、温かみ) */
  --font-heading-thai: 'Chonburi', cursive;  /* タイ語見出し(彫り込んだような太いディスプレイ体) */
  --font-body-jp: 'Kiwi Maru', sans-serif;   /* 日本語本文(柔らかく読みやすい) */
  --font-body-thai: 'Mitr', sans-serif;      /* タイ語本文(丸みがあり視認性が高い) */
}
```

適用ルール: 日本語テキストブロック(`.story-viewer__text-block--ja` 等)には `--font-body-jp`、タイ語テキストブロックには `--font-body-thai` を指定。見出し(`h1`, `h3`, `h4`)は日本語なら `--font-heading-jp`、タイ語混在見出しがあれば該当部分に `--font-heading-thai` を部分適用。

### サイズスケール(基準16px = 1rem)

| トークン | サイズ | 用途 |
|---|---|---|
| `--text-xs` | 0.8rem (12.8px) | 読み方(reading)、ページ数表示、キャプション |
| `--text-sm` | 0.9rem (14.4px) | 補助テキスト、ボタン内の小文字 |
| `--text-base` | 1rem (16px) | 基準サイズ(直接使うことは少ない) |
| `--text-body` | 1.15rem (18.4px) | 本文(モバイル、現行踏襲) |
| `--text-body-lg` | 1.25rem (20px) | 本文(PC、768px以上) |
| `--text-lg` | 1.4rem (22.4px) | カード内見出し(h3/h4)、review__word(モバイル) |
| `--text-xl` | 1.9rem (30.4px) | アプリタイトル(モバイル) |
| `--text-2xl` | 2.2rem (35.2px) | アプリタイトル(PC)、review__word(PC) |

行間: 本文 `line-height: 1.9`(現行踏襲、可読性重視のため維持)、見出し `line-height: 1.3`。

---

## 3. スペーシング

4pxベースのスケール。既存コードは `rem` 直書きが多いが、今後は以下のトークンを基準に統一する。

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

目安: ボタンの内側パディングは `--space-2 / --space-5`(縦/横)、カード内パディングは `--space-6〜--space-8`、セクション間の余白は `--space-8〜--space-12`。

---

## 4. 角の丸みのルール

「均一な角丸」を避けるため、要素の性質ごとに丸み方を変える。丸いのはあくまで「機能上の例外」(アイコンボタンのみ)とし、それ以外は木や紙の「直線的な四角さ」を基調にする。

| 要素 | border-radius | 意図 |
|---|---|---|
| `.app`(外枠) | `6px` | 本の表紙のような直線的な形。四隅均等だが控えめ |
| `.story-viewer__image`(挿絵枠) | `4px` | 額装のような直線的な縁 |
| `.story-viewer__card` / 単語詳細カード | `4px` | 角丸をほぼ排除し、紙のカードらしい直角に近い形 |
| `.story-viewer__text-block` | `0 4px 4px 0` | 左側(見出し罫線と接する側)は直角、右側のみ微丸 |
| `.review__card`(フラッシュカード) | `3px` | ほぼ直角、カードらしい厳格な四角形 |
| `.story-viewer__toggle`(表示トグル) | `4px 4px 0 0` | 上のみ丸い「付箋・タブ」形状。角丸ピルをやめる |
| `.story-viewer__nav button`(次へ) | `4px 28px 4px 28px` | 右上・左下のみ大きく丸める非対称形(焼き印風) |
| `.story-viewer__nav button`(戻る) | `28px 4px 28px 4px` | 次へボタンと対角に丸みを配置し、左右で形が異なることを明示 |
| `.review__next` | `4px 28px 4px 28px` | ナビゲーション「次へ」と統一 |
| 音声再生ボタン(アイコンボタン) | `50%` | **唯一の完全な円**。アイコンボタンという機能種別を視覚的に区別するための意図的な例外 |
| `.story-viewer__page-count`(しおりタブ) | 角丸ではなく `clip-path` で三角の切込み(詳細は6章) | しおりが挟まっている形状 |
| `.story-viewer__word`(単語タップ部分) | `2px` | ほぼ直角。ハイライト背景のみで「太字タップ可能」を示す |

**焼き印ボタンの実装方法:** `border-radius` の4値指定(top-left / top-right / bottom-right / bottom-left)で対角のみを大きくする。「次へ」は前進のイメージで右上に、「戻る」は後退のイメージで左上に丸みの起点を置く、というように意味も持たせる。

---

## 5. 影の使い方

### 基本シャドウ(現行の2種を継続、色のみ更新)

```css
:root {
  --shadow-soft: 0 8px 20px rgba(62, 39, 35, 0.25);
  --shadow-card: 0 12px 28px rgba(62, 39, 35, 0.22);
}
```

### 新規: 本の厚み表現(多重シャドウ)

閉じた本を横から見たときの「ページが重なった段差」を、単色の帯を1pxずつずらして重ねることで表現する。`.app`(外枠)、`.story-viewer__image`(挿絵)、`.review__card`(フラッシュカード)に適用。

```css
:root {
  --shadow-book-edge:
    0 2px 0 #ecdfc0,
    0 4px 0 #dfd0ab,
    0 6px 0 #d3c298,
    0 9px 16px rgba(62, 39, 35, 0.35);
}
```

- 1〜3段目: 半透明ではなく不透明の色帯(紙の断面色を段階的に暗く)。ページが数枚重なっている質感を出す
- 4段目: 通常のぼかし影(接地感を出す)
- 使用箇所ごとに段数・オフセット量を微調整してよい(例: フラッシュカードは3段、`.app`は4段など、同じ効果を機械的に使い回さない)

### フォーカス・ホバー

フォーカスリングは真鍮色を使用: `outline: 2px solid var(--color-brass); outline-offset: 2px;`(現行の `--color-accent` から変更)。

---

## 6. SVGアクセントの実装方針

JSX構造を変更しない前提のため、**インラインSVGをコンポーネントに追加するのではなく、CSSの疑似要素(`::after`など)にdata URI SVGを`background-image`として敷く方針**で統一する。React側の変更は不要。

### 6-1. 見出し下の手描き波線アンダーライン

`.app__header h1::after` などに適用。

```css
.app__header h1::after {
  content: '';
  display: block;
  width: 56%;
  height: 10px;
  margin: var(--space-2) auto 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 16'%3E%3Cpath d='M2 9 C 20 2, 35 14, 55 7 S 90 2, 110 9 S 145 15, 165 6 S 190 3, 198 8' fill='none' stroke='%236B4226' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
```

- パスの制御点を不規則にする(等間隔の波にしない)ことで「手描き感」を出す
- 使用箇所(`.story-viewer__card h3` など)ごとに `stroke` の色をCSS変数の値に置き換えた別バリエーションを用意し、同一パスの使い回しでも `transform: scaleX(-1)` や `rotate(0.5deg)` を個別に加えて均一さを崩す

### 6-2. しおりタブ(ページ番号)

`clip-path` で三角の切込みを作る(SVG画像ではなくCSS単体で実装。色をCSS変数で制御しやすいため)。

```css
.story-viewer__page-count {
  position: relative;
  background: var(--color-brass);
  color: var(--color-surface-raised);
  padding: var(--space-2) var(--space-3) var(--space-4);
  clip-path: polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%);
}
```

PC版レイアウトでは `.story-viewer__nav` 内ではなく右端に `position: absolute` で固定配置し、非対称性を強調する(6章の実装詳細はステップ3で調整)。

### 6-3. 木目調グラデーション(単語詳細カードの枠)

`repeating-linear-gradient` で縦ストライプの濃淡を作り、`background-image` として重ねる(画像アセット不要)。単語詳細カード(`.story-viewer__card`)とフラッシュカード裏面(`.review__card--flipped`)に適用。テキストが乗る通常の`.story-viewer__text-block`には適用しない(可読性を優先)。

```css
.story-viewer__card {
  background-color: var(--color-surface-raised);
  background-image: repeating-linear-gradient(
    180deg,
    rgba(107, 66, 38, 0.22) 0px,
    rgba(107, 66, 38, 0.22) 3px,
    rgba(107, 66, 38, 0.08) 3px,
    rgba(107, 66, 38, 0.08) 6px,
    transparent 6px,
    transparent 15px
  );
}
```

濃い帯(22%)・中間帯(8%)・透明部分の3層構成にすることで、均等すぎない年輪のような不規則さを出している(初期案は5%・2px幅のみで薄すぎたため強化)。

### 方針まとめ

| 要素 | 手法 | 理由 |
|---|---|---|
| 波線アンダーライン | data URI SVG(background-image) | 曲線パスが必要、色違いバリエーションも作りやすい |
| しおりタブの切込み | `clip-path`(SVG不使用) | 色をCSS変数で動的制御したい、形状もシンプル |
| 木目ストライプ | `repeating-linear-gradient`(SVG不使用) | 単純な縞模様のため画像化する必要がない |
| ページ送り矢印アイコン(必要な場合) | data URI SVG | 直線的な矢印ではなく手描き風カーブにするため |

すべて画像アセットファイルを追加せず、CSS内(data URIまたはグラデーション関数)で完結させる。`public/` 以下に新規ファイルは追加しない。

---

## 7. レイアウト方針(追記: 画像を主役にする)

初期実装ではPC版(768px以上)のみ画像とテキストを左右2カラムのgridで配置していたが、将来的に画像内の要素(挿絵の中の人物・動物など)もタップ可能にし、画像を探索する体験を中心にする方針としたため、以下に変更した。

- 画面幅を問わず「画像→トグル→本文→ナビ」の**縦積みで統一**(2カラムgridは廃止)
- 画像(`.story-viewer__image`)は`.story-viewer`のコンテンツ幅いっぱい(`.app`の余白を除いた幅)を使用
- 本文(`.story-viewer__text`)とナビ(`.story-viewer__nav`)は`max-width: 640px; margin: 0 auto;`で中央寄せして幅を絞り、画像より明確に狭くすることで画像を相対的に大きく見せる
- 画像のアスペクト比は`4:3`を維持(幅が約2倍近くになるため、これだけで十分に大きく見える)

---

以上がステップ2のデザインシステム定義です。この内容でよければステップ3(StoryViewer.css / Review.css / App.cssへの実装)に進みます。調整したい箇所があれば教えてください。

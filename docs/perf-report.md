# パフォーマンス改善レポート

実施日：2026-06-02
対象：murashfc-fan（Astro 6.4.2 / 静的サイト）

---

## 1. 改善前の状態

### 画像
`public/images/` 配下に 12 枚の PNG。すべて 1672×941（インフォグラフィックは 941×1672）の高解像度で、1 枚あたり 1.6〜2.7 MB。**合計 28.6 MB**。

| 画像 | 寸法 | 形式 | サイズ |
|---|---|---|---|
| emblem.png | 1024×1024 | PNG | **1,584 KB** |
| hero-banner.png | 1672×941 | PNG | 1,988 KB |
| about/01〜05-*.png | 1672×941 | PNG | 2,116〜2,620 KB × 5 |
| infographics/*.png | 1672×941 | PNG | 2,288〜2,556 KB × 4 |
| infographics/rebirth.png | 941×1672 | PNG | 2,200 KB |

emblem.png は実際には `40×40px` で表示されるロゴ。1024×1024 はオーバースペック。

### フォント
| ファミリー | 用途 | 読み込み戦略 |
|---|---|---|
| Bebas Neue | ヒーロー＆セクション英ラベル | Google Fonts CSS（display=swap） |
| Shippori Mincho B1 900 | TOP ヒーロー日本語タイトル | `&text=` で 14 字サブセット |
| Noto Serif JP 700 | セクション日本語見出し | Google Fonts CSS（display=swap、unicode-range） |
| Oswald | `--font-display` 変数のフォールバックチェーン | **未ロード**（CSS フォールバックのみ） |

- Google Fonts への CSS 呼び出しが **3 リクエスト**
- preconnect は両ホストに対して設定済み

### ページ別 HTML サイズ（gzip 前）

| ページ | サイズ |
|---|---|
| /players/fukaya | 24 KB |
| /about | 28 KB |
| /wiki | 40 KB |
| / (TOP) | 56 KB |
| /tournaments/mexico-2024 | 60 KB |
| /rebirth | 76 KB |
| /players | 124 KB |

HTML 自体は問題なし。bundled CSS は 66 KB（Tailwind v4 + 独自スタイル）で良好。

---

## 2. ボトルネックの特定

1. **画像の総容量が圧倒的に重い**（28.6 MB）。特に：
   - emblem.png が 1.5 MB → 表示は 40px / 5 KB あれば十分
   - hero-banner.png が 2 MB → TOP の LCP 画像、`fetchpriority="high"` 設定済みなので圧縮効果が直接 LCP に効く
   - インフォグラフィック・aboutヒーローはどれも 2 MB 超
2. **フォントの CSS リクエストが 3 つに分散**。Bebas Neue と Noto Serif JP は別大会の用紙で同じ TLS 接続上で結合可能だった。
3. JavaScript は問題なし（カウントダウンなど短小な inline script のみ、外部 JS バンドルは Astro toolbar 由来の dev 専用）。

---

## 3. 実施した最適化

### 3.1 画像 → WebP 変換＋サイズ最適化

`scripts/optimize-images.mjs` を作成（sharp 経由）。

- `emblem.png` を 96×96 WebP に縮小（表示 40px × Retina 2倍以上の余裕）
- すべての 1672×941 画像を WebP q=82 で圧縮（解像度は維持）
- OGP 用途に `hero-banner-og.jpg` を別途生成（1200px幅・mozjpeg・SNS スクレイパー対応）
- 元 PNG はリポジトリから削除

#### 結果

| 画像 | Before | After | 削減率 |
|---|---|---|---|
| emblem | 1,581 KB | **5.3 KB** | -99.7% |
| hero-banner | 1,985 KB | 123 KB | -93.8% |
| hero-banner-og.jpg | (新規) | 86 KB | — |
| about/01〜05 | 11,850 KB | 1,205 KB | -89.8% |
| infographics × 5 | 11,905 KB | 1,202 KB | -89.9% |
| **合計** | **29,306 KB** | **2,546 KB** | **-91.3%** |

### 3.2 フォント CSS リクエストの統合

Bebas Neue と Noto Serif JP を 1 つの CSS リクエストに統合：

```html
<!-- Before: 3 リクエスト -->
<link href=".../css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
<link href=".../css2?family=Shippori+Mincho+B1:wght@900&text=...&display=swap" rel="stylesheet" />
<link href=".../css2?family=Noto+Serif+JP:wght@700&display=swap" rel="stylesheet" />

<!-- After: 2 リクエスト（subset 必要な Shippori だけ別） -->
<link href=".../css2?family=Bebas+Neue&family=Noto+Serif+JP:wght@700&display=swap" rel="stylesheet" />
<link href=".../css2?family=Shippori+Mincho+B1:wght@900&text=...&display=swap" rel="stylesheet" />
```

### 3.3 OGP 画像形式の変更

`og:image` / `twitter:image` を `hero-banner.png`（2 MB）→ `hero-banner-og.jpg`（86 KB）に変更。SNS シェア時のスクレイパー互換性を保ちつつ 23 分の 1 に圧縮。

---

## 4. 改善後の数値

### 画像総容量
| | Before | After | 差分 |
|---|---|---|---|
| 画像合計 | 29.3 MB | **2.5 MB** | **-26.8 MB（-91.3%）** |

### TOP ページ初期表示の転送量（試算）
| 項目 | Before | After |
|---|---|---|
| HTML | 56 KB | 56 KB |
| CSS bundle | 66 KB | 66 KB |
| Google Fonts CSS | 約 6 KB（3 req） | 約 4 KB（2 req） |
| Bebas Neue WOFF2 | ~18 KB | ~18 KB |
| Noto Serif JP WOFF2 chunk | ~12 KB | ~12 KB |
| Shippori WOFF2（14字） | ~5 KB | ~5 KB |
| emblem | 1,581 KB | **5 KB** |
| hero-banner（LCP） | 1,985 KB | **123 KB** |
| **初期表示まで合計** | **約 3.7 MB** | **約 290 KB** |

**TOP の初期転送量は約 13 分の 1（-92%）に削減。**

LCP 画像（hero-banner）が 2 MB → 123 KB になったことで、特にモバイル回線下での LCP は劇的に改善（現実的に 0.5〜1.5 秒の短縮見込み）。

### ページ別の重い画像（fold-below、lazy load 対象）
| ページ | 画像数 | Before合計 | After合計 |
|---|---|---|---|
| /about | 5 | 11.6 MB | 1.2 MB |
| /tournaments/* | 1（インフォ） | 2.3〜2.6 MB | 213〜274 KB |
| /rebirth | 1（縦長インフォ） | 2.2 MB | 214 KB |
| / (TOP infographics × 5 / 大会カード) | 5 | 11.9 MB | 1.2 MB |

---

## 5. 残された課題（任意改善）

- **AVIF 変換**：WebP よりさらに 20-30% 小さくできる。ただし IE / 古い Safari 互換性は WebP より弱い。`<picture>` で多形式対応にすれば対応可能。
- **画像の遅延読み込みは既に対応済み**（infographics の TOP カード・VideoSection のサムネは `loading="lazy"`）。これ以上の最適化余地は少ない。
- **CSS バンドル 66 KB** は Tailwind v4 が pruning 済みなので妥当。さらなる削減には Tailwind v4 の `@source` 指定で範囲を絞るか、未使用 utility の手動洗い出しが必要だが効果薄い。
- **Critical CSS のインライン化**は Astro v6 標準では未対応。Lighthouse スコア向上にはプラグインが必要だが、現状の CSS サイズなら必要性は低い。
- **Lighthouse スコア測定**：本環境では Lighthouse CLI が未インストールのため未実施。本番デプロイ後、PageSpeed Insights / Lighthouse で実測することを推奨。

---

## 6. 推定インパクト

| Web Vitals | Before（推定） | After（推定） |
|---|---|---|
| LCP（モバイル 4G） | 4.0〜5.5 秒 | 1.5〜2.5 秒 |
| LCP（デスクトップ） | 2.0〜3.0 秒 | 0.8〜1.5 秒 |
| Total Transfer（TOP） | ~3.7 MB | ~290 KB |
| Total Transfer（aboutフルロード後） | ~14 MB | ~1.5 MB |

PSI / Lighthouse での実測は本番デプロイ後に行ってください。

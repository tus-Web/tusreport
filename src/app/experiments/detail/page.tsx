'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './detail.module.css';

interface ExperimentData {
  id: string;
  title: string;
  description: string;
  date: string;
  deadline: string;
  texCode: string;
}

export default function ExperimentDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const experimentId = searchParams.get('id');
  
  const [experiment, setExperiment] = useState<ExperimentData | null>(null);
  const [copied, setCopied] = useState(false);

  // 実験データの定義
  const experimentsData: Record<string, ExperimentData> = {
    '1': {
      id: '1',
      title: '第１回 重力加速度',
      description: '自由落下実験による重力加速度の測定',
      date: '2025年4月15日',
      deadline: '2025年4月22日',
      texCode: `\\documentclass[11pt]{jsarticle}
\\usepackage[dvipdfmx]{graphicx}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{booktabs}
\\usepackage{siunitx}

\\title{工学基礎実験 第1回レポート\\\\重力加速度の測定}
\\author{学籍番号: \\quad\\quad\\quad\\quad\\quad 氏名: \\quad\\quad\\quad\\quad\\quad}
\\date{実験日: 2025年4月15日\\quad提出日: \\today}

\\begin{document}

\\maketitle

\\section{実験目的}
自由落下実験を通して重力加速度$g$を測定し、理論値と比較する。

\\section{実験原理}
物体が高さ$h$から自由落下する時、落下時間を$t$とすると、以下の運動方程式が成り立つ。

\\begin{equation}
h = \\frac{1}{2}gt^2
\\end{equation}

これより、重力加速度$g$は次式で求められる。

\\begin{equation}
g = \\frac{2h}{t^2}
\\end{equation}

\\section{実験装置}
\\begin{itemize}
    \\item 鋼球（直径\\SI{20}{mm}）
    \\item 光電ゲート
    \\item ストップウォッチ
    \\item 定規（\\SI{1}{m}）
    \\item 実験台
\\end{itemize}

\\section{実験方法}
\\begin{enumerate}
    \\item 光電ゲートを設置し、落下距離$h$を測定する
    \\item 鋼球を静かに落下させ、落下時間$t$を測定する
    \\item 異なる高さで5回ずつ測定を行う
    \\item 各高さでの平均値を求める
\\end{enumerate}

\\section{実験結果}

\\subsection{測定データ}
\\begin{table}[h]
\\centering
\\caption{落下時間の測定結果}
\\begin{tabular}{ccccccc}
\\toprule
高さ [m] & 1回目 [s] & 2回目 [s] & 3回目 [s] & 4回目 [s] & 5回目 [s] & 平均 [s] \\\\
\\midrule
0.5 & & & & & & \\\\
1.0 & & & & & & \\\\
1.5 & & & & & & \\\\
2.0 & & & & & & \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\subsection{重力加速度の計算}
各高さにおける重力加速度を式(2)を用いて計算する。

\\begin{table}[h]
\\centering
\\caption{重力加速度の計算結果}
\\begin{tabular}{ccc}
\\toprule
高さ [m] & 平均時間 [s] & 重力加速度 [m/s²] \\\\
\\midrule
0.5 & & \\\\
1.0 & & \\\\
1.5 & & \\\\
2.0 & & \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\section{考察}
\\begin{itemize}
    \\item 測定された重力加速度の平均値：\\SI{}{m/s^2}
    \\item 理論値（\\SI{9.8}{m/s^2}）との誤差：\\SI{}{\\%}
    \\item 誤差の要因：空気抵抗、測定機器の精度、実験手法の限界など
\\end{itemize}

\\section{結論}
自由落下実験により重力加速度$g$を測定した結果、理論値に近い値が得られた。
誤差の要因として空気抵抗や測定精度の限界が考えられる。

\\end{document}`
    },
    '2': {
      id: '2',
      title: '第２回 ヤング率の測定',
      description: 'フックの法則を用いたヤング率の測定',
      date: '2025年4月22日',
      deadline: '2025年4月29日',
      texCode: `\\documentclass[11pt]{jsarticle}
\\usepackage[dvipdfmx]{graphicx}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{booktabs}
\\usepackage{siunitx}

\\title{工学基礎実験 第2回レポート\\\\ヤング率の測定}
\\author{学籍番号: \\quad\\quad\\quad\\quad\\quad 氏名: \\quad\\quad\\quad\\quad\\quad}
\\date{実験日: 2025年4月22日\\quad提出日: \\today}

\\begin{document}

\\maketitle

\\section{実験目的}
金属線の引張試験によりフックの法則を確認し、ヤング率を測定する。

\\section{実験原理}
長さ$L$、断面積$A$の金属線に荷重$F$を加えたときの伸び$\\Delta L$は、
弾性限度内では荷重に比例する（フックの法則）。

\\begin{equation}
F = k\\Delta L
\\end{equation}

ヤング率$E$は以下の式で定義される。

\\begin{equation}
E = \\frac{\\sigma}{\\varepsilon} = \\frac{F/A}{\\Delta L/L} = \\frac{FL}{A\\Delta L}
\\end{equation}

\\section{実験装置}
\\begin{itemize}
    \\item 金属線（銅線、直径\\SI{0.5}{mm}）
    \\item 荷重（分銅）
    \\item マイクロメーター
    \\item 定規
    \\item 実験架台
\\end{itemize}

\\section{実験方法}
\\begin{enumerate}
    \\item 金属線の直径と長さを測定する
    \\item 金属線を実験架台に固定する
    \\item 段階的に荷重を加え、各荷重での伸びを測定する
    \\item 荷重と伸びの関係をグラフにプロットする
\\end{enumerate}

\\section{実験結果}

\\subsection{金属線の仕様}
\\begin{itemize}
    \\item 材質：銅
    \\item 直径：\\SI{}{mm}
    \\item 長さ：\\SI{}{m}
    \\item 断面積：\\SI{}{m^2}
\\end{itemize}

\\subsection{測定データ}
\\begin{table}[h]
\\centering
\\caption{荷重と伸びの測定結果}
\\begin{tabular}{cc}
\\toprule
荷重 [N] & 伸び [mm] \\\\
\\midrule
0 & 0 \\\\
1 & \\\\
2 & \\\\
3 & \\\\
4 & \\\\
5 & \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\section{考察}
\\begin{itemize}
    \\item 荷重と伸びの関係は直線的であり、フックの法則が成り立つことが確認できた
    \\item 測定されたヤング率：\\SI{}{Pa}
    \\item 銅の理論値（\\SI{110e9}{Pa}）との比較
    \\item 誤差の要因：測定精度、材料の不均一性など
\\end{itemize}

\\section{結論}
金属線の引張試験により、フックの法則を確認し、ヤング率を測定することができた。

\\end{document}`
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    if (experimentId && experimentsData[experimentId]) {
      setExperiment(experimentsData[experimentId]);
    } else {
      router.push('/experiments');
    }
  }, [session, status, router, experimentId]);

  const handleCopyCode = async () => {
    if (experiment?.texCode) {
      try {
        await navigator.clipboard.writeText(experiment.texCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('コピーに失敗しました:', err);
      }
    }
  };

  const handleDownloadCode = () => {
    if (experiment?.texCode) {
      const blob = new Blob([experiment.texCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `experiment_${experiment.id}_report.tex`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (!session || !experiment) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>{experiment.title}</h1>
          <p className={styles.description}>{experiment.description}</p>
          <div className={styles.experimentInfo}>
            <span className={styles.infoItem}>実験日: {experiment.date}</span>
            <span className={styles.infoItem}>提出期限: {experiment.deadline}</span>
          </div>
        </header>

        <Card className={styles.codeCard}>
          <CardHeader className={styles.codeHeader}>
            <CardTitle className={styles.codeTitle}>
              LaTeX レポートテンプレート
            </CardTitle>
            <div className={styles.codeActions}>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                className={styles.actionButton}
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    コピー済み
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    コピー
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownloadCode}
                className={styles.downloadButton}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                ダウンロード
              </Button>
            </div>
          </CardHeader>
          <CardContent className={styles.codeContent}>
            <pre className={styles.codeBlock}>
              <code>{experiment.texCode}</code>
            </pre>
          </CardContent>
        </Card>

        <div className={styles.instructions}>
          <Card className={styles.instructionCard}>
            <CardHeader>
              <CardTitle className={styles.instructionTitle}>
                使用方法
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className={styles.instructionList}>
                <li>上記のLaTeXコードをコピーまたはダウンロードしてください</li>
                <li>TeXエディタ（TeXShop、TeXstudio、Overleafなど）で開いてください</li>
                <li>学籍番号と氏名を記入してください</li>
                <li>実験データを測定し、該当箇所に入力してください</li>
                <li>考察と結論を記述してください</li>
                <li>PDFにコンパイルして提出してください</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className={styles.navigation}>
          <Link href="/experiments">
            <Button variant="outline" className={styles.backButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              実験一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from '@/components/ui/upload';
import styles from './experiment.module.css';

interface ExperimentData {
  id: string;
  title: string;
  description: string;
  excelFile?: string;
  texCode?: string;
}

export default function ExperimentDetailPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const params = useParams();
  const experimentSlug = params?.experiment as string;
  
  const [experiment, setExperiment] = useState<ExperimentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 実験基本データの定義（スラッグをキーとして管理）
  const experimentsBaseData: Record<string, Omit<ExperimentData, 'texCode'>> = {
    'gravity': {
      id: '1',
      title: '第１回 重力加速度',
      description: '自由落下実験による重力加速度の測定',
      excelFile: '実験1重力加速度エミュレータ.xlsx'
    },
    'youngs-modulus': {
      id: '2',
      title: '第２回 ヤング率の測定',
      description: 'フックの法則を用いたヤング率の測定',
      excelFile: '実験2ヤング率の測定エミュレータ.xlsx'
},
    'frank-hertz': {
      id: '3',
      title: '第３回 フランク・ヘルツの実験',
      description: '原子の励起エネルギーの測定',
      excelFile: '実験3フランクヘルツの実験エミュレータ.xlsx'
    },
    'light-diffraction': {
      id: '4',
      title: '第４回 光の回折',
      description: '光の波長特性と回折現象の観察',
      excelFile: '実験4光の回折エミュレータ.xlsx'
    },
    'temperature-coefficient': {
      id: '5',
      title: '第５回 電気抵抗の温度係数の計測',
      description: '金属の電気抵抗と温度の関係性の測定',
      excelFile: '実験5電気抵抗の温度係数の計測エミュレータ.xlsx'
    },
    'melting-point': {
      id: '6',
      title: '第６回 金属の融点の測定',
      description: '金属材料の融点特性の測定',
      excelFile: '実験6金属の融点の測定エミュレータ.xlsx'
    },
    'radiation-measurement': {
      id: '7',
      title: '第７回 放射線計測',
      description: '放射線の検出と測定技術',
      excelFile: '実験7放射線測定エミュレータ.xlsx'
    },
    'physical-pendulum': {
      id: '8',
      title: '第８回 実体振り子',
      description: '振り子の周期と重力加速度の関係',
      excelFile: '実験8実体振り子エミュレータ.xlsx'
    },
    'string-resonance': {
      id: '9',
      title: '第９回 弦の共振',
      description: '弦の振動と共振現象の観察',
      excelFile: '実験9弦の共振エミュレータ.xlsx'
    },
    'oscilloscope': {
      id: '10',
      title: '第１０回 オシロスコープ',
      description: 'オシロスコープの操作と波形観測',
      excelFile: '実験10オシロスコープエミュレータ.xlsx'
    },
    'pc-disassembly': {
      id: '11',
      title: '第１１回 PC分解実験',
      description: 'コンピューターの内部構造の理解',
      excelFile: '実験11PC分解実験エミュレータ.xlsx'
    }
  };

  // Gemini APIを呼び出してTeX コードを生成
  const generateTexCode = async (expId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-tex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experimentId: expId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API呼び出しに失敗しました');
      }

      const data = await response.json();
      return data.texCode;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'TeX コードの生成に失敗しました';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    
    if (experimentSlug && experimentsBaseData[experimentSlug]) {
      const baseData = experimentsBaseData[experimentSlug];
      setExperiment({ ...baseData });
      // 自動生成は行わず、ボタンで生成する
    } else {
      router.push('/department/1');
    }
  }, [isLoaded, isSignedIn, router, experimentSlug]);

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

  const handleRegenerateCode = async () => {
    if (experiment) {
      const newTexCode = await generateTexCode(experiment.id);
      if (newTexCode) {
        setExperiment(prev => prev ? { ...prev, texCode: newTexCode } : null);
      }
    }
  };

  const handleGenerateCode = async () => {
    if (experiment) {
      const newTexCode = await generateTexCode(experiment.id);
      if (newTexCode) {
        setExperiment(prev => prev ? { ...prev, texCode: newTexCode } : null);
      }
    }
  };

  const handleDownloadExcel = () => {
    if (experiment?.excelFile) {
      const fileName = experiment.excelFile;
      const a = document.createElement('a');
      a.href = `/api/files/download/${encodeURIComponent(fileName)}`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleUploadExcel = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    console.log(file);
  }

  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          読み込み中...
        </div>
      </div>
    );
  }

  if (!isSignedIn || !experiment) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>{experiment.title}</h1>
          <p className={styles.description}>{experiment.description}</p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {!experiment.texCode ? (
              <Button onClick={handleGenerateCode} disabled={loading}>
                {loading ? 'TeXコードを生成中...' : 'TeXコードを作成'}
              </Button>
            ) : (
              <Button onClick={handleRegenerateCode} variant="outline" disabled={loading}>
                {loading ? '再生成中...' : '再生成'}
              </Button>
            )}
            <Button onClick={handleDownloadExcel} variant="outline" disabled={loading}>
              Excelダウンロード
            </Button>
          </div>
        </header>

        {error && (
          <Card className={styles.errorCard}>
            <CardContent className={styles.errorContent}>
              <div className={styles.errorMessage}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.errorIcon}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                エラー: {error}
              </div>
              <Button
                onClick={handleRegenerateCode}
                className={styles.retryButton}
                disabled={loading}
              >
                再試行
              </Button>
            </CardContent>
          </Card>
        )}

        {experiment.texCode && (
          <Card className={styles.codeCard}>
            <CardHeader className={styles.codeHeader}>
              <CardTitle className={styles.codeTitle}>
                LaTeX レポートテンプレート
                <span className={styles.aiGenerated}>AI生成</span>
              </CardTitle>
              <div className={styles.codeActions}>
                <Button
                  onClick={handleRegenerateCode}
                  variant="outline"
                  className={styles.actionButton}
                  disabled={loading}
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
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                  再生成
                </Button>
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
                        <path d="M4 16c-1.1 0-2-.9-2 2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
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
        )}

        {!experiment.texCode && !loading && (
          <>
            <div className={styles.upload}>
              <Card className={styles.uploadCard}>
                <CardHeader>
                  <CardTitle className={styles.uploadTitle}>
                    Excelファイルアップロード
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Upload
                    className={styles.uploadArea}
                    onDrop={handleUploadExcel}
                    accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }}
                    multiple={false}
                  />
                </CardContent>
              </Card>
            </div>

            <div className={styles.instructions}>
              <Card className={styles.instructionCard}>
                <CardHeader>
                  <CardTitle className={styles.instructionTitle}>
                    TeXコード未生成
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={styles.stepsContainer}>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepTitle}>Excelファイルを<br/>ダウンロード</div>
                      <div className={styles.stepDescription}>
                        実験データを記入するためのExcelファイルをダウンロードしてください
                      </div>
                    </div>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepTitle}>データを記入</div>
                      <div className={styles.stepDescription}>
                        ダウンロードしたファイルに実験データを記入してください
                      </div>
                    </div>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepTitle}>ファイルを<br/>アップロード</div>
                      <div className={styles.stepDescription}>
                        記入したExcelファイルをアップロードしてください
                      </div>
                    </div>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>4</div>
                      <div className={styles.stepTitle}>TeXコードを生成</div>
                      <div className={styles.stepDescription}>
                        「TeXコードを作成」ボタンを押してテンプレートを生成してください
                      </div>
                    </div>
                    <div className={styles.stepCard}>
                      <div className={styles.stepNumber}>5</div>
                      <div className={styles.stepTitle}>コピー</div>
                      <div className={styles.stepDescription}>
                        生成後、コードをコピーできます
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <div className={styles.navigation}>
          <Link href="/department/1">
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

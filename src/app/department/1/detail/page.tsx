'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from '@/components/ui/upload';
import styles from './detail.module.css';

interface ExperimentData {
  id: string;
  title: string;
  description: string;
  date: string;
  deadline: string;
  texCode?: string;
  excelFile: string;
}

export default function ExperimentDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const experimentId = searchParams.get('id');
  
  const [experiment, setExperiment] = useState<ExperimentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 実験基本データの定義
  const experimentsBaseData: Record<string, Omit<ExperimentData, 'texCode'>> = {
    '1': {
      id: '1',
      title: '第１回 重力加速度',
      description: '自由落下実験による重力加速度の測定',
      date: '2025年4月15日',
      deadline: '2025年4月22日',
      excelFile: '実験1重力加速度エミュレータ.xlsx'
    },
    '2': {
      id: '2',
      title: '第２回 ヤング率の測定',
      description: 'フックの法則を用いたヤング率の測定',
      date: '2025年4月22日',
      deadline: '2025年4月29日',
      excelFile: '実験2ヤング率の測定エミュレータ.xlsx'
    },
    '3': {
      id: '3',
      title: '第３回 フランク・ヘルツの実験',
      description: '原子の励起エネルギーの測定',
      date: '2025年4月29日',
      deadline: '2025年5月6日',
      excelFile: '実験3フランクヘルツの実験エミュレータ.xlsx'
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
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    if (experimentId && experimentsBaseData[experimentId]) {
      const baseData = experimentsBaseData[experimentId];
      setExperiment({ ...baseData, texCode: undefined });
      // 自動生成は行わず、ボタンで生成する
    } else {
      router.push('/department/1');
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

  const handleRegenerateCode = async () => {
    if (experiment && experimentId) {
      const newTexCode = await generateTexCode(experimentId);
      if (newTexCode) {
        setExperiment(prev => prev ? { ...prev, texCode: newTexCode } : null);
      }
    }
  };

  const handleGenerateCode = async () => {
    if (experimentId) {
      const newTexCode = await generateTexCode(experimentId);
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

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          読み込み中...
        </div>
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
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <Link href="/setting">
              <Button variant="outline">設定</Button>
            </Link>
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
        )}

        {!experiment.texCode && !loading && (
          <>
            <div className={styles.instructions}>
              <Card className={styles.instructionCard}>
                <CardHeader>
                  <CardTitle className={styles.instructionTitle}>
                    TeXコード未生成
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className={styles.instructionList}>
                    <li>Excelファイルをダウンロードしてください</li>
                    <li>ダウンロードしたファイルにデータを記入してください</li>
                    <li>記入したExcelファイルをアップロードしてください</li>
                    <li>「TeXコードを作成」を押してテンプレートを生成してください</li>
                    <li>生成後、コピーまたはダウンロードできます</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
            
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

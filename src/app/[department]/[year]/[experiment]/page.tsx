'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TexGenerationError } from '@/components/TexGenerationError';
import { TexResultModal } from '@/components/ui/TexResultModal';
import { useTexGenerator } from '@/hooks/useTexGenerator';
import styles from './experiment.module.css';
import { EmblaCarousel } from '@/components/ui/EmblaCarousel';

interface ExperimentData {
  id: string;
  title: string;
  description: string;
  excelFile?: string;
  texCode?: string;
}

interface UploadedExcelData {
  fileName: string;
  sheetName: string;
  uploadedAt: string;
  data?: Record<string, unknown>;
}

export default function ExperimentDetailPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const experimentSlug = params?.experiment as string;
  const { loading, error, generateTexCode } = useTexGenerator();
  
  const [experiment, setExperiment] = useState<ExperimentData | null>(null);
  const [showTexModal, setShowTexModal] = useState(false);
  const [uploadedExcelData, setUploadedExcelData] = useState<UploadedExcelData | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 実験基本データの定義（スラッグをキーとして管理）
  const experimentsBaseData: Record<string, Omit<ExperimentData, 'texCode'>> = useMemo(() => ({
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
      excelFile: '実験5電気抵抗と温度計数エミュレータ.xlsx'
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
      excelFile: '実験8実体ふりこ.xlsx'
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
      description: 'オシロスコープの操作と波形観測'
      // excelFile: '実験10オシロスコープエミュレータ.xlsx' // ファイルが存在しないためコメントアウト
    },
    'pc-disassembly': {
      id: '11',
      title: '第１１回 PC分解実験',
      description: 'コンピューターの内部構造の理解'
      // excelFile: '実験11PC分解実験エミュレータ.xlsx' // ファイルが存在しないためコメントアウト
    }
  }), []);

  // Gemini SDKを使用してPDFからTeX コードを生成
  const handleGenerateCode = useCallback(async () => {
    if (experiment) {
      console.log('Starting TeXcode generation...');
      const newTexCode = await generateTexCode(experiment.id, uploadedExcelData || undefined);
      if (newTexCode) {
        console.log('TeXcode generated successfully, setting state...');
        setExperiment(prev => prev ? { ...prev, texCode: newTexCode } : null);
        // TeXコード生成直後にモーダルを表示
        setTimeout(() => {
          console.log('Showing modal...');
          setShowTexModal(true);
        }, 100);
      }
    }
  }, [experiment, generateTexCode, uploadedExcelData]);

  const handleRegenerateCode = useCallback(async () => {
    if (experiment) {
      console.log('Starting TeXcode regeneration...');
      const newTexCode = await generateTexCode(experiment.id, uploadedExcelData || undefined);
      if (newTexCode) {
        console.log('TeXcode regenerated successfully, setting state...');
        setExperiment(prev => prev ? { ...prev, texCode: newTexCode } : null);
        // TeXコード再生成直後にモーダルを表示
        setTimeout(() => {
          console.log('Showing modal...');
          setShowTexModal(true);
        }, 100);
      }
    }
  }, [experiment, generateTexCode, uploadedExcelData]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    
    if (experimentSlug && experimentsBaseData[experimentSlug]) {
      const baseData = experimentsBaseData[experimentSlug];
      setExperiment({ ...baseData });
    } else {
      router.push('/department/1');
    }
  }, [isLoaded, isSignedIn, router, experimentSlug, experimentsBaseData]);

  const handleDownloadExcel = useCallback(async () => {
    if (experiment?.excelFile) {
      try {
        const fileName = experiment.excelFile;
        const response = await fetch(`/api/files/download/${encodeURIComponent(fileName)}`);
        
        if (!response.ok) {
          throw new Error('ファイルのダウンロードに失敗しました');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download error:', error);
        alert('ファイルのダウンロードに失敗しました。しばらく時間をおいて再度お試しください。');
      }
    }
  }, [experiment?.excelFile]);

  const handleUploadExcel = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    if (!experiment) {
      console.error('Experiment not found');
      setUploadError('実験情報が見つかりません');
      return;
    }

    setUploadError(null); // エラーをクリア

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('experimentId', experiment.id);

      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ファイルのアップロードに失敗しました');
      }

      const result = await response.json();
      console.log('Excel upload successful:', result);
      
      // アップロードされたExcelデータを保存
      setUploadedExcelData(result.data);
      
    } catch (error) {
      console.error('Excel upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Excelファイルのアップロードに失敗しました。';
      setUploadError(errorMessage);
    }
  }, [experiment]);

  // ステップデータの定義
  const stepsData = useMemo(() => [
    {
      number: 1,
      title: 'Excelファイルをダウンロード',
      description: '実験データを記入するためのExcelファイルをダウンロードしてください',
      imageSrc: '/assets/undraw_spreadsheets_bh6n.svg',
      ctaText: 'Excelダウンロード',
      ctaAction: handleDownloadExcel,
      showUpload: false
    },
    {
      number: 2,
      title: 'ファイルをアップロード',
      description: '記入したExcelファイルをアップロードしてください',
      imageSrc: '/assets/undraw_upload_cucu.svg',
      ctaText: 'ファイルを選択',
      showUpload: true,
      onUpload: handleUploadExcel
    },
    {
      number: 3,
      title: 'TeXコードを生成',
      description: '「TeXコードを作成」ボタンを押してテンプレートを生成してください',
      imageSrc: '/assets/undraw_artificial-intelligence_43qa.svg',
      ctaText: experiment?.texCode ? '再生成' : 'TeXコードを作成',
      ctaAction: experiment?.texCode ? handleRegenerateCode : handleGenerateCode,
      showUpload: false
    },
    {
      number: 4,
      title: 'レポートを完成',
      description: '生成されたコードをコピーしてレポートを完成させてください',
      imageSrc: '/assets/undraw_report.svg',
      ctaText: 'コピーする',
      ctaAction: () => {},
      showUpload: false
    }
  ], [experiment, handleDownloadExcel, handleGenerateCode, handleRegenerateCode, handleUploadExcel]);

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
        {/* 左上の戻るボタン */}
        <div className={styles.backButtonContainer}>
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
              <span className={styles.backButtonText}></span>実験一覧に戻る
            </Button>
          </Link>
        </div>
        
        <header className={styles.header}>
          <h1 className={styles.title}>{experiment.title}</h1>
          <p className={styles.description}>{experiment.description}</p>
          {/* <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {!experiment.texCode ? (
              <Button onClick={handleGenerateCode} disabled={loading}>
                {loading ? 'TeXコードを生成中...' : 'TeXコードを作成'}
              </Button>
            ) : (
              <Button onClick={handleRegenerateCode} variant="outline" disabled={loading}>
                {loading ? '再生成中...' : '再生成'}
              </Button>
            )}
            <Button onClick={handleDownloadExcel} variant="outline" disabled={loading || !experiment.excelFile}>
              Excelダウンロード
            </Button> */}
          {/* </div> */}
        </header>


        <EmblaCarousel 
          steps={stepsData} 
          isLoading={loading}
          loadingMessage={experiment?.texCode ? "TeXコードを再生成中..." : "AI がTeXコードを生成中..."}
          uploadedExcelData={uploadedExcelData}
          uploadError={uploadError}
        />


        {error && (
          <TexGenerationError 
            error={error}
            onRetry={handleRegenerateCode}
            isLoading={loading}
          />
        )}

        {experiment.texCode && (
          <>
            {console.log('Modal state:', showTexModal, 'TexCode exists:', !!experiment.texCode)}
            <TexResultModal
              isOpen={showTexModal}
              onClose={() => {
                console.log('Closing modal...');
                setShowTexModal(false);
              }}
              texCode={experiment.texCode}
              experimentTitle={experiment.title}
              onRegenerate={handleRegenerateCode}
              isLoading={loading}
            />
            {/* <TexCodeDisplay 
              texCode={experiment.texCode}
              experimentId={experiment.id}
              onRegenerate={handleRegenerateCode}
              isLoading={loading}
            /> */}
          </>
        )}
      </div>
    </div>
  );
}



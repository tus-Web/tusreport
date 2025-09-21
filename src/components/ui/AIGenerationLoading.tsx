'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import styles from './AIGenerationLoading.module.css';

interface AIGenerationLoadingProps {
  message?: string;
}

export function AIGenerationLoading({ message = 'AI がTeXコードを生成中...' }: AIGenerationLoadingProps) {
  return (
    <div className={styles.loadingOverlay}>
      <Card className={styles.loadingCard}>
        <CardContent className={styles.loadingContent}>
          {/* ローディングスピナー */}
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
          
          {/* AI生成のイラスト */}
          <div className={styles.imageContainer}>
            <Image
              src="/assets/undraw_artificial-intelligence_43qa.svg"
              alt="AI生成中"
              width={150}
              height={150}
              className={styles.loadingImage}
            />
          </div>
          
          {/* メッセージ */}
          <div className={styles.messageContainer}>
            <h3 className={styles.mainMessage}>{message}</h3>
            <p className={styles.subMessage}>
              しばらくお待ちください。高品質なレポートテンプレートを作成しています。
            </p>
          </div>
          
          {/* プログレスバー風のアニメーション */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <p className={styles.progressText}>処理中...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
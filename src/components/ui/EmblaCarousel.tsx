import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from '@/components/ui/upload'
import { AIGenerationLoading } from '@/components/ui/AIGenerationLoading'
import Image from 'next/image'
import style from './EmblaCarousel.module.css'

interface StepData {
  number: number;
  title: string;
  description: string;
  imageSrc: string;
  ctaText: string;
  ctaAction?: () => void;
  showUpload?: boolean;
  onUpload?: (files: File[]) => void;
}

interface EmblaCarouselProps {
  steps: StepData[];
  isLoading?: boolean;
  loadingMessage?: string;
}

export function EmblaCarousel({ steps, isLoading = false, loadingMessage }: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

  // ファイルが選択されたときに呼ばれる関数
  const handleFileSelect = (files: File[]) => {
    console.log("選択されたファイル:", files);
    setUploadedFiles(files);
    
    // ファイルアップロード後、1秒後に次のカードに移動
    setTimeout(() => {
      if (emblaApi) {
        emblaApi.scrollNext();
      }
    }, 1000);
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // CTAボタンクリック時の処理（カード1,2の場合は1秒後に次のカードに移動）
  const handleCtaClick = useCallback((step: StepData) => {
    // まず元のアクションを実行
    if (step.ctaAction) {
      step.ctaAction();
    }

    // カード1または2の場合、1秒後に次のカードに移動
    if (step.number === 1 || step.number === 2) {
      setTimeout(() => {
        if (emblaApi) {
          emblaApi.scrollNext();
        }
      }, 1000);
    }
  }, [emblaApi]);

  return (
    <>
      {/* ローディング画面のオーバーレイ */}
      {isLoading && <AIGenerationLoading message={loadingMessage} />}
      
      <div className={style.embla}>
        <div className={style.embla__viewport} ref={emblaRef}>
          <div className={style.embla__container}>
            {steps.map((step) => (
              <div key={step.number} className={style.embla__slide}>
                <Card className={style.stepCard}>
                  <CardContent className={style.stepContent}>
                    {/* 左上のステップ番号 */}
                    <div className={style.stepNumber}>{step.number}</div>
                    
                    {/* 中央のタイトル */}
                    <h2 className={style.stepTitle}>{step.title}</h2>
                    
                    {/* 画像とdescriptionの並列表示 */}
                    <div className={style.contentRow}>
                      <div className={style.imageContainer}>
                        <Image
                          src={step.imageSrc}
                          alt={step.title}
                          width={200}
                          height={200}
                          className={style.stepImage}
                        />
                      </div>
                      <div className={style.descriptionContainer}>
                        <p className={style.stepDescription}>{step.description}</p>
                      </div>
                    </div>
                    
                    {/* 下部のCTAボタンまたはUploadコンポーネント */}
                    <div className={style.ctaContainer}>
                      {step.showUpload ? (
                        uploadedFiles.length === 0 ? (
                          <div className={style.uploadWrapper}>
                            <Upload
                              className={style.uploadComponent}
                              accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }}
                              multiple={false}
                              onDrop={step.onUpload || handleFileSelect}
                              onFileSelect={handleFileSelect}
                            />
                          </div>
                        ) : (
                          <div className={style.uploadedFiles}>
                            <h4>ファイルのアップロードに成功しました！</h4>
                            <ul>
                              {uploadedFiles.map((file) => (
                                <li key={file.name}>{file.name}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      ) : (
                      <Button
                        onClick={() => handleCtaClick(step)}
                        className={style.ctaButton}
                        size="lg"
                        disabled={isLoading}
                        >
                          {step.ctaText}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <button className={style.embla__prev} onClick={scrollPrev} disabled={isLoading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18L9 12L15 6" />
          </svg>
        </button>
        <button className={style.embla__next} onClick={scrollNext} disabled={isLoading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18L15 12L9 6" />
          </svg>
        </button>
      </div>
    </>
  )
}

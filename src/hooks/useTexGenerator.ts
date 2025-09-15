import { useState } from 'react';

interface UseTexGeneratorResult {
  loading: boolean;
  error: string | null;
  generateTexCode: (expId: string) => Promise<string | null>;
}

export const useTexGenerator = (): UseTexGeneratorResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 実験IDに応じたプロンプトを生成
  const generatePromptForExperiment = (expId: string): string => {
    const prompts: Record<string, string> = {
      '1': `このPDFファイルは東京理科大学の物理学実験「重力加速度の測定」の実験資料です。
このPDFの内容を元に、工学基礎実験の「重力加速度の測定」実験のLaTeXレポートテンプレートを生成してください。

以下の要件を満たしてください：
- jsarticleクラスを使用
- dvipdfmx、amsmath、amssymb、booktabs、siunitxパッケージを含む
- 実験目的、実験原理、実験装置、実験方法、実験結果、考察、結論のセクション
- 自由落下の運動方程式 h = (1/2)gt² を含む
- 重力加速度 g = 2h/t² の導出
- 測定データ用の表（高さと落下時間）
- 計算結果用の表（重力加速度）
- 学籍番号と氏名の記入欄
- 実験日：2025年4月15日、提出日：\\todayを設定

完全なLaTeXコードとして出力してください。コードブロックの記号は含めないでください。`,
      '2': `このPDFファイルを参考に、ヤング率の測定実験のLaTeXレポートテンプレートを生成してください。`,
      '3': `このPDFファイルを参考に、フランク・ヘルツの実験のLaTeXレポートテンプレートを生成してください。`
    };
    
    return prompts[expId] || `このPDFファイルを参考に、実験${expId}のLaTeXレポートテンプレートを生成してください。`;
  };

  // Gemini SDKを使用してPDFからTeX コードを生成
  const generateTexCode = async (expId: string): Promise<string | null> => {
    console.log('generateTexCode called with expId:', expId);
    setLoading(true);
    setError(null);
    
    try {
      // Gemini SDKをdynamic importで読み込み
      console.log('Importing GoogleGenAI...');
      const { GoogleGenAI } = await import('@google/genai');
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API キーが設定されていません');
      }
      
      console.log('Creating GoogleGenAI instance...');
      const genAI = new GoogleGenAI({ 
        apiKey: apiKey
      });
      
      // PDFファイルを取得
      console.log('Fetching PDF file...');
      const pdfUrl = '/i-1-later/pdf/東京理科大_物理学実験_重力加速度_2024ver (1).pdf';
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`PDFファイルの読み込みに失敗しました: ${response.status} ${response.statusText}`);
      }
      
      console.log('Converting PDF to base64...');
      const arrayBuffer = await response.arrayBuffer();
      
      // ArrayBufferのサイズをチェック
      const sizeInMB = arrayBuffer.byteLength / (1024 * 1024);
      console.log(`PDF file size: ${sizeInMB.toFixed(2)} MB`);
      
      if (sizeInMB > 20) {
        throw new Error('PDFファイルが大きすぎます（20MB以下にしてください）');
      }
      
      // Uint8Arrayを使用してより安全にbase64変換
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // FileReaderを使用してより安全にbase64変換
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // data:application/pdf;base64, を除去
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      // 実験に応じたプロンプトを生成
      console.log('Generating prompt...');
      const promptText = generatePromptForExperiment(expId);
      
      console.log('Calling Gemini API...');
      const contents = [
        {
          text: promptText
        },
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: base64Data
          }
        }
      ];
      
      const result = await genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: contents
      });
      
      console.log('Gemini API response received:', result);
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0]) {
        const texCode = result.candidates[0].content.parts[0].text;
        console.log('TeX code generated successfully');
        return texCode || null;
      } else {
        console.error('Invalid API response structure:', result);
        throw new Error('Gemini APIから有効な応答が得られませんでした');
      }
    } catch (err) {
      console.error('Error in generateTexCode:', err);
      const errorMessage = err instanceof Error ? err.message : 'TeX コードの生成に失敗しました';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateTexCode
  };
};
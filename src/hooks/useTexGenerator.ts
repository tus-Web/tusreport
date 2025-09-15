import { useState } from 'react';

interface UseTexGeneratorResult {
  loading: boolean;
  error: string | null;
  generateTexCode: (expId: string) => Promise<string | null>;
}

export const useTexGenerator = (): UseTexGeneratorResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API エンドポイントを使用してTeX コードを生成
  const generateTexCode = async (expId: string): Promise<string | null> => {
    console.log('generateTexCode called with expId:', expId);
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
        throw new Error(errorData.error || 'TeX コードの生成に失敗しました');
      }

      const data = await response.json();
      console.log('TeX code generated successfully');
      return data.texCode || null;
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
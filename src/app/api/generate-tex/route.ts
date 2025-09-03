import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// より新しいAPI バージョンとモデル名を使用
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

interface ExperimentPrompts {
  [key: string]: string;
}

const experimentPrompts: ExperimentPrompts = {
  '1': `工学基礎実験の「重力加速度の測定」実験のLaTeXレポートテンプレートを生成してください。
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
  '2': `工学基礎実験の「ヤング率の測定」実験のLaTeXレポートテンプレートを生成してください。
以下の要件を満たしてください：

- jsarticleクラスを使用
- dvipdfmx、amsmath、amssymb、booktabs、siunitxパッケージを含む
- 実験目的、実験原理、実験装置、実験方法、実験結果、考察、結論のセクション
- フックの法則 F = kΔL を含む
- ヤング率の式 E = FL/(AΔL) を含む
- 金属線（銅線）の仕様記録欄
- 荷重と伸びの測定データ用の表
- 学籍番号と氏名の記入欄
- 実験日：2025年4月22日、提出日：\\todayを設定

完全なLaTeXコードとして出力してください。コードブロックの記号は含めないでください。`,
  '3': `工学基礎実験の「フランク・ヘルツの実験」のLaTeXレポートテンプレートを生成してください。
以下の要件を満たしてください：

- jsarticleクラスを使用
- dvipdfmx、amsmath、amssymb、booktabs、siunitxパッケージを含む
- 実験目的、実験原理、実験装置、実験方法、実験結果、考察、結論のセクション
- 原子の励起エネルギーに関する理論
- 水銀原子の励起電位の測定
- 電流-電圧特性の測定データ用の表
- グラフ作成の指示
- 学籍番号と氏名の記入欄
- 実験日：2025年4月29日、提出日：\\todayを設定

完全なLaTeXコードとして出力してください。コードブロックの記号は含めないでください。`
};

export async function GET() {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API キーが設定されていません' },
        { status: 500 }
      );
    }

    // 利用可能なモデルをリストアップ
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    
    if (!modelsResponse.ok) {
      const errorData = await modelsResponse.json();
      return NextResponse.json({
        error: 'モデルリストの取得に失敗しました',
        details: errorData
      }, { status: 500 });
    }

    const modelsData = await modelsResponse.json();
    return NextResponse.json({ models: modelsData });

  } catch (error) {
    console.error('Models API Error:', error);
    return NextResponse.json(
      { error: 'モデルリスト取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { experimentId } = await request.json();

    if (!experimentId || !experimentPrompts[experimentId]) {
      return NextResponse.json(
        { error: '無効な実験IDです' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API キーが設定されていません' },
        { status: 500 }
      );
    }

    const prompt = experimentPrompts[experimentId];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      let errorMessage = 'Gemini APIの呼び出しに失敗しました';
      if (errorData?.error?.message) {
        errorMessage = `Gemini API Error: ${errorData.error.message}`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini API response structure:', data);
      return NextResponse.json(
        { error: 'Gemini APIから有効な応答が得られませんでした' },
        { status: 500 }
      );
    }

    const texCode = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      texCode: texCode.trim()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

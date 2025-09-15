import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenAI({ apiKey });

// 実験IDとPDFファイルのマッピング
const experimentPdfMap: Record<string, string> = {
  '1': '2025_工学基礎実験_重力加速度.pdf',
  '2': 'ヤング率の測定_工学基礎実験2025.pdf',
  '3': 'フランクヘルツの実験.pdf', // 実際のファイル名に合わせて調整
  '4': '光の回折.pdf', // 実際のファイル名に合わせて調整
  '5': '2020_電気抵抗の温度係数の計測.pdf',
  '6': '金属の融点の測定.pdf', // 実際のファイル名に合わせて調整
  '7': '工学基礎実験(放射線計測)v7.4.pdf',
  '8': '実体振り子.pdf',
  '9': '弦の共振.pdf', // 実際のファイル名に合わせて調整
  '10': 'オシロスコープ.pdf', // 実際のファイル名に合わせて調整
  '11': 'PC分解実験.pdf', // 実際のファイル名に合わせて調整
};

export async function POST(request: NextRequest) {
  try {
    const { experimentId } = await request.json();

    if (!experimentId) {
      return NextResponse.json(
        { error: '実験IDが指定されていません' },
        { status: 400 }
      );
    }

    // PDFファイル名を取得
    const pdfFileName = experimentPdfMap[experimentId];
    if (!pdfFileName) {
      return NextResponse.json(
        { error: `実験ID ${experimentId} に対応するPDFファイルが見つかりません` },
        { status: 404 }
      );
    }

    // PDFファイルのパスを構築
    const pdfPath = path.join(process.cwd(), 'public', 'i-1-later', 'pdf', pdfFileName);

    // PDFファイルの存在確認
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { error: `PDFファイルが見つかりません: ${pdfFileName}` },
        { status: 404 }
      );
    }

    // PDFファイルを読み込み、Base64エンコード
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    // 実験に応じたプロンプトを生成
    const promptText = 
    `このPDFファイルの指示通りに、実験のLaTeXレポートテンプレートを生成してください。以下の要件に従ってください：
    1. 日本語でのレポート形式
    2. 実験の目的、理論、方法、結果、考察、結論のセクションを含む
    3. 必要な数式や図表の挿入位置を示す
    4. 実験データを記入できる表やグラフの雛形を含む
    5. 参考文献の記載方法を示す
    生成するのはLaTeXコードのみで、説明文は不要です。`;

    // Gemini APIを呼び出し
    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64
        }
      }
    ];

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: contents
    });

    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0]) {
      const texCode = response.candidates[0].content.parts[0].text;
      
      if (!texCode) {
        return NextResponse.json(
          { error: 'TeX コードの生成に失敗しました' },
          { status: 500 }
        );
      }

      return NextResponse.json({ texCode });
    } else {
      return NextResponse.json(
        { error: 'Gemini APIから有効な応答が得られませんでした' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error generating TeX code:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

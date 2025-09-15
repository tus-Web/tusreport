import { NextRequest, NextResponse } from 'next/server';

// 現在このAPIは使用されていません
// すべての処理はクライアントサイドのGemini SDKで実行されています

export async function GET() {
  return NextResponse.json({ 
    message: 'このAPIは現在使用されていません。処理はクライアントサイドで実行されています。',
    status: 'deprecated'
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'このAPIは現在使用されていません。処理はクライアントサイドで実行されています。',
    status: 'deprecated'
  });
}

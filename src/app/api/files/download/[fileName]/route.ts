import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ fileName: string }> }) {
  try {
    // TODO: 認証チェックを追加

    // ファイルパスを取得
    const { fileName } = await params;

    // セキュリティチェック：パストラバーサル攻撃を防ぐ
    if (fileName.includes('..') || fileName.includes('/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // ファイルの完全パス
    const filePath = join(process.cwd(), 'public', 'excel', fileName);
    
    // ファイルを読み込み
    const fileBuffer = await readFile(filePath);
    
    // レスポンスヘッダーを設定
    const headers = new Headers();
    // 日本語ファイル名に対応するためUTF-8エンコードを使用
    const encodedFileName = encodeURIComponent(fileName);
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
    headers.set('Content-Type', 'application/octet-stream');
    
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'File not found or server error' }, 
      { status: 500 }
    );
  }
}
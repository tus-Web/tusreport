import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest, { params }: { params: { fileName: string } }) {
  try {
    // TODO: 認証チェックを追加

    // ファイルパスを取得
    const { fileName } = params;

    // セキュリティチェック：パストラバーサル攻撃を防ぐ
    if (fileName.includes('..') || fileName.includes('/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // ファイルの完全パス
    const filePath = join(process.cwd(), 'assets', 'files', fileName);
    
    // ファイルを読み込み
    const fileBuffer = await readFile(filePath);
    
    // レスポンスヘッダーを設定
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Type', 'application/octet-stream');
    
    return new NextResponse(fileBuffer as any, {
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

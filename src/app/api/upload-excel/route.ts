import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const experimentId = formData.get('experimentId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    if (!experimentId) {
      return NextResponse.json(
        { error: '実験IDが指定されていません' },
        { status: 400 }
      );
    }

    // ファイル形式のチェック
    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json(
        { error: '.xlsx形式のファイルのみサポートしています' },
        { status: 400 }
      );
    }

    // ファイルを読み込み
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // xlsxライブラリでExcelファイルを解析
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // 最初のシートを取得
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // シートをJSONに変換
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1, // 行番号をキーとして使用
      defval: '', // 空セルのデフォルト値
    });

    // 解析されたデータを整理
    const excelData = {
      fileName: file.name,
      sheetName: firstSheetName,
      data: jsonData,
      experimentId: experimentId,
      uploadedAt: new Date().toISOString(),
    };

    // セッションストレージやデータベースに保存する場合はここで処理
    // 現時点では解析したデータをそのまま返す
    return NextResponse.json({
      success: true,
      message: 'Excelファイルの解析が完了しました',
      data: excelData
    });

  } catch (error) {
    console.error('Excel upload error:', error);
    return NextResponse.json(
      { error: 'Excelファイルの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
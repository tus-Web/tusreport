import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const DEV_PASSWORD = 'tus4624';

export async function POST(request: Request) {
  // 開発環境でのみ有効
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'この機能は開発環境でのみ利用可能です' },
      { status: 403 }
    );
  }

  try {
    const { devPassword } = await request.json();

    // 開発者パスワードの確認
    if (devPassword !== DEV_PASSWORD) {
      return NextResponse.json(
        { error: '開発者パスワードが正しくありません' },
        { status: 401 }
      );
    }

    // テスト用のメールアドレスとパスワードを自動生成
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@ed.tus.ac.jp`;
    const testPassword = 'TestPass123!'; // 固定のテストパスワード

    // 既存のテストユーザーをチェック（同じメールアドレスは作らない）
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    if (existingUser) {
      // 既にある場合は新しいタイムスタンプで再試行
      const newEmail = `test-${timestamp + 1}@ed.tus.ac.jp`;
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      const user = await prisma.user.create({
        data: {
          email: newEmail,
          password: hashedPassword,
          emailVerified: new Date(), // 即座に認証済みにする
        }
      });

      return NextResponse.json({
        message: '開発モード: テストアカウントを作成しました',
        email: newEmail,
        testPassword: testPassword
      });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // テストユーザーの作成（メール認証済みとして）
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        emailVerified: new Date(), // 即座に認証済みにする
      }
    });

    return NextResponse.json({
      message: '開発モード: テストアカウントを作成しました',
      email: user.email,
      testPassword: testPassword
    });

  } catch (error) {
    console.error('Dev signup error:', error);
    return NextResponse.json(
      { error: '開発モードでの登録処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
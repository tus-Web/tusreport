import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { isFirebaseConfigured } from '@/lib/firebase-config';

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
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase is not configured. Please complete the setup.' },
        { status: 503 }
      );
    }

    const { userService } = await import('@/lib/firebase-db');
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
    const existingUser = await userService.findByEmail(testEmail);

    if (existingUser) {
      // 既にある場合は新しいタイムスタンプで再試行
      const newEmail = `test-${timestamp + 1}@ed.tus.ac.jp`;
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      const user = await userService.create({
        email: newEmail,
        password: hashedPassword,
      });
      
      // メール認証済みにする
      await userService.updateEmailVerified(user.id, new Date());

      return NextResponse.json({
        message: '開発モード: テストアカウントを作成しました',
        email: newEmail,
        testPassword: testPassword
      });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // テストユーザーの作成（メール認証済みとして）
    const user = await userService.create({
      email: testEmail,
      password: hashedPassword,
    });
    
    // メール認証済みにする
    await userService.updateEmailVerified(user.id, new Date());

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
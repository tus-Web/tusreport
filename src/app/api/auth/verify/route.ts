import { NextResponse } from 'next/server';
import { isFirebaseConfigured } from '@/lib/firebase-config';

export async function POST(request: Request) {
  try {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase is not configured. Please complete the setup.' },
        { status: 503 }
      );
    }

    const { userService, verificationTokenService } = await import('@/lib/firebase-db');
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: '認証トークンが必要です' },
        { status: 400 }
      );
    }

    // トークンの検証
    const verificationToken = await verificationTokenService.findByToken(token);

    if (!verificationToken) {
      return NextResponse.json(
        { error: '無効な認証トークンです' },
        { status: 400 }
      );
    }

    // トークンの有効期限チェック
    if (verificationToken.expires < new Date()) {
      // 期限切れのトークンを削除
      await verificationTokenService.delete(verificationToken.id);

      return NextResponse.json(
        { error: '認証トークンの有効期限が切れています' },
        { status: 400 }
      );
    }

    // ユーザー情報を取得
    const user = await userService.findById(verificationToken.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 400 }
      );
    }

    // ユーザーのメール認証を完了
    await userService.updateEmailVerified(verificationToken.userId, new Date());

    // 使用済みのトークンを削除
    await verificationTokenService.delete(verificationToken.id);

    return NextResponse.json({
      message: 'メールアドレスの認証が完了しました',
      email: user.email
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: '認証処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
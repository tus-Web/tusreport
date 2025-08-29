import { NextResponse } from 'next/server';
import { userService, verificationTokenService } from '@/lib/user-store';

export async function POST(request: Request) {
  try {
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

    // トークンの有効期限確認
    if (new Date() > verificationToken.expires) {
      return NextResponse.json(
        { error: '認証トークンの有効期限が切れています' },
        { status: 400 }
      );
    }

    // ユーザーのメール認証を完了
    await userService.verifyEmail(verificationToken.userId);

    // トークンを削除
    await verificationTokenService.delete(verificationToken.id);

    return NextResponse.json({
      message: 'メールアドレスの認証が完了しました',
      success: true,
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: '認証処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
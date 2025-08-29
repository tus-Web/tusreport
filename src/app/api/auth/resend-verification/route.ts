import { NextResponse } from 'next/server';
import { userService, verificationTokenService } from '@/lib/user-store';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスが必要です' },
        { status: 400 }
      );
    }

    // ユーザーの確認
    const user = await userService.findByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'このメールアドレスは登録されていません' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に認証済みです' },
        { status: 400 }
      );
    }

    // 新しい認証トークンの生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await verificationTokenService.create(user.id, verificationToken);

    // 認証メールの再送信
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { error: 'メール送信に失敗しました。しばらくしてから再度お試しください。' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '認証メールを再送信しました',
      success: true,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: '認証メールの再送信中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
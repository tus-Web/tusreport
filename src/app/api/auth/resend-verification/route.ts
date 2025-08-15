import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    const user = await prisma.user.findUnique({
      where: { email }
    });

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

    // 既存の未使用トークンを削除
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id }
    });

    // 新しい認証トークンの生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

    await prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expires,
      }
    });

    // 認証メールの再送信
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: '認証メールの送信に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '認証メールを再送信しました'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: '再送信処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
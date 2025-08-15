import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      );
    }

    // @ed.tus.ac.jpドメインのチェック
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ed\.tus\.ac\.jp$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '@ed.tus.ac.jpのメールアドレスのみ登録可能です' },
        { status: 400 }
      );
    }

    // パスワードの長さチェック
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上で設定してください' },
        { status: 400 }
      );
    }

    // 既存ユーザーのチェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    });

    // 認証トークンの生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

    await prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expires,
      }
    });

    // 認証メールの送信
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (!emailResult.success) {
      // メール送信に失敗した場合でも、ユーザー作成は成功しているので
      // エラーではなく警告として扱う
      console.error('Failed to send verification email:', emailResult.error);
      return NextResponse.json({
        message: 'ユーザー登録は完了しましたが、認証メールの送信に失敗しました。',
        warning: true
      });
    }

    return NextResponse.json({
      message: 'ユーザー登録が完了しました。認証メールをご確認ください。',
      email: user.email
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '登録処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
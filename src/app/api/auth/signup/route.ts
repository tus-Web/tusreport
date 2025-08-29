import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userService, verificationTokenService } from '@/lib/user-store';
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

    // 既存ユーザーの確認
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // ユーザーの作成
    const user = await userService.create({
      email,
      password,
    });

    // 認証トークンの生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await verificationTokenService.create(user.id, verificationToken);

    // 認証メールの送信
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // メール送信に失敗してもユーザー登録は成功とする
    }

    return NextResponse.json({
      message: 'ユーザー登録が完了しました。メールアドレスに送信された認証リンクをクリックしてください。',
      success: true,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'ユーザー登録中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
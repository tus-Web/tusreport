import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userService } from '@/lib/user-store';

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

    // 開発用ユーザーを作成
    const devUsers = [
      {
        email: 'dev1@ed.tus.ac.jp',
        password: 'dev12345',
        name: 'Developer 1',
      },
      {
        email: 'dev2@ed.tus.ac.jp',
        password: 'dev12345',
        name: 'Developer 2',
      },
      {
        email: 'admin@ed.tus.ac.jp',
        password: 'admin12345',
        name: 'Admin User',
      },
    ];

    const createdUsers = [];

    for (const userData of devUsers) {
      // 既存ユーザーの確認
      const existingUser = await userService.findByEmail(userData.email);
      if (existingUser) {
        continue; // 既に存在する場合はスキップ
      }

      // ユーザーの作成
      const user = await userService.create({
        email: userData.email,
        password: userData.password,
        name: userData.name,
      });

      // メール認証済みにする
      await userService.verifyEmail(user.id);

      createdUsers.push({
        email: user.email,
        name: user.name,
      });
    }

    // 最初のユーザー情報を自動ログイン用に返す
    const firstUser = devUsers[0];
    
    return NextResponse.json({
      message: `開発用ユーザーが作成されました`,
      users: createdUsers,
      note: 'これらのユーザーは既にメール認証済みです',
      // 自動ログイン用の情報
      email: firstUser.email,
      testPassword: firstUser.password,
    });
  } catch (error) {
    console.error('Dev signup error:', error);
    return NextResponse.json(
      { error: '開発用ユーザーの作成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
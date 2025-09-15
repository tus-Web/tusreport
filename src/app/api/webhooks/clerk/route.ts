import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { clerkClient } from '@clerk/nextjs/server';
import { WebhookEvent } from '@clerk/nextjs/server';

// 許可するメールドメイン
const ALLOWED_DOMAIN = '@ed.tus.ac.jp';

export async function POST(req: Request) {
  // Webhookの署名を検証
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // ヘッダーから署名情報を取得
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // リクエストボディを取得
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Webhookインスタンスを作成
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // 署名を検証
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // イベントタイプを確認
  const eventType = evt.type;
  console.log(`Webhook received: ${eventType}`);

  // ユーザー作成イベントの処理
  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;
    
    // メールアドレスを確認
    const primaryEmail = email_addresses[0]?.email_address;
    
    if (primaryEmail && !primaryEmail.endsWith(ALLOWED_DOMAIN.substring(1))) {
      console.log(`Unauthorized email domain detected: ${primaryEmail}`);
      
      try {
        // 不正なドメインのユーザーを削除
        const clerk = await clerkClient();
        await clerk.users.deleteUser(id);
        console.log(`User ${id} with email ${primaryEmail} has been deleted due to unauthorized domain`);
        
        return NextResponse.json({
          success: true,
          message: 'User deleted due to unauthorized email domain',
          deletedUserId: id,
        });
      } catch (error) {
        console.error('Failed to delete user:', error);
        return NextResponse.json(
          { error: 'Failed to delete unauthorized user' },
          { status: 500 }
        );
      }
    }
    
    console.log(`User ${id} with email ${primaryEmail} is authorized`);
  }

  return NextResponse.json({
    success: true,
    message: 'Webhook processed successfully',
  });
}
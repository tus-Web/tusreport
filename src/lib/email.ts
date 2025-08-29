import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'メールアドレスの認証',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">メールアドレスの認証</h2>
        <p>アカウント登録ありがとうございます。</p>
        <p>以下のボタンをクリックして、メールアドレスの認証を完了してください。</p>
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 6px;
                    display: inline-block;">
            メールアドレスを認証する
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          このリンクは24時間有効です。<br>
          ボタンがクリックできない場合は、以下のURLをブラウザにコピーしてください：
        </p>
        <p style="color: #667eea; word-break: break-all;">
          ${verificationUrl}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          このメールに心当たりがない場合は、無視してください。
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}
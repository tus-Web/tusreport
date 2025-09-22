/**
 * 東京理科大学のメールアドレス形式をバリデーションする関数
 * @param email - 検証するメールアドレス
 * @returns 有効な場合true、無効な場合false
 */
export function validateTusEmail(email: string): boolean {
  // 数字@ed.tus.ac.jp の形式をチェック
  const tusEmailRegex = /^\d+@ed\.tus\.ac\.jp$/;
  return tusEmailRegex.test(email);
}

/**
 * メールアドレスの入力値から学生番号部分を抽出する
 * @param email - メールアドレス
 * @returns 学生番号部分（数字のみ）
 */
export function extractStudentNumber(email: string): string | null {
  const match = email.match(/^(\d+)@ed\.tus\.ac\.jp$/);
  return match ? match[1] : null;
}

/**
 * 学生番号からTUSメールアドレスを生成する
 * @param studentNumber - 学生番号
 * @returns TUSメールアドレス
 */
export function generateTusEmail(studentNumber: string): string {
  return `${studentNumber}@ed.tus.ac.jp`;
}
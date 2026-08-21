export const poptomoIdPattern = /^\d{4}-\d{4}-\d{4}$/;
export const passwordPattern = /^[a-z0-9]{4,16}$/i;

export async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);

  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export const roles = ['USER', 'ADMIN', 'BOT'] as const;

export type Role = (typeof roles)[number];

export interface Session {
  id: string;
  name: string;
  role: Role;
}

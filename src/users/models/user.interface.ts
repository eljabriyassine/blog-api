export interface User {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export interface User {
  idUser: string;
  created_at: string | Date;
  active: number;
  avatar: string | null;
  userName: string;
  email: string;
}

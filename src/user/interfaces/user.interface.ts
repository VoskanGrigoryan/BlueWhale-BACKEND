// import { Document } from 'mongoose';

export interface UserInterface {
  readonly id: string;
  readonly user_name: string;
  readonly email: string;
  readonly role: string;
  readonly created_at: string;
}

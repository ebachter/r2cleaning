import {z} from 'zod';
import {users} from '../../prisma/pclient';
import {TableUsers, TypeContacts} from './typesTables';

export type TypeUser = Omit<users, 'user_id'> & {user_id: number | null}; /* {
  userId: number | null;
  email: string;
  username: string;
  name: string;
  language: 'en' | 'de';
  timezone: string;
  userImageHash: string;
  plan: 'basic' | 'professional';
} */

export const userSchema = z.object({
  userId: z.number().nullable(),
  email: z.string(),
  username: z.string(),
  name: z.string(),
  language: z.union([z.literal('en'), z.literal('de')]),
  timezone: z.string(),
  userImageHash: z.string(),
  plan: z.union([z.literal('basic'), z.literal('professional')]),
});

export type TypeUserContacts = Pick<
  TypeContacts,
  'contact_id' | 'confirm_date' | 'rejected_at'
> & {user_fk: number} & Pick<
    TableUsers,
    'username' | 'name' | 'bio' | 'language' | 'timezone' | 'user_image_hash'
  >;

/* export interface ContactWithUserId extends Omit<TypeUserContacts, 'user_fk'> {
  userId: number;
} */

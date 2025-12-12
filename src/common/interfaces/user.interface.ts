import { Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
}

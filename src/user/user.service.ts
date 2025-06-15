/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

export interface User {
  id: number;
  username: string;
  password: string; // hashed
}

const USERS_PATH = path.resolve(process.cwd(), 'src/users.json');

@Injectable()
export class UserService {
  private users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      const data = fs.readFileSync(USERS_PATH, 'utf-8');
      this.users = JSON.parse(data) as User[];
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
      } else {
        console.error('Unknown error', e);
      }
      this.users = [];
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    // Input validation
    if (!username?.trim() || !password?.trim()) {
      return null;
    }

    const user = this.users.find((u: User) => u.username === username);
    if (!user) return null;

    try {
      // Type guard for password validation
      if (typeof user.password !== 'string' || !user.password.trim()) {
        return null;
      }

      // Use bcrypt.compare with proper await handling
      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        user.password,
      );

      return isPasswordValid ? user : null;
    } catch (error) {
      // Enhanced error handling with proper typing
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error during password validation';

      console.error('Error during password validation:', {
        username,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });

      return null;
    }
  }
}

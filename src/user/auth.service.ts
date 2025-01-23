import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import e from 'express';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // hash user password

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.userService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [users] = await this.userService.find(email);
    if (!users) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = users.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Password is incorrect');
    }
    return users;
  }
}

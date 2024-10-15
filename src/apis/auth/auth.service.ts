import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './models/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(login: LoginDto) {
    const user = await this.validateUser(login.username, login.password)

    if(!user) throw new NotFoundException("user not found")
      
    const payload = { username: login.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {secret: process.env.JWT_SECRET}),
    };
  }
}

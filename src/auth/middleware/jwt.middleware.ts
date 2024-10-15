import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../apis/user/user.service';

class JwtMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async run(req: any, res: any, next: () => void) {
    const authHeader = req?.headers?.authorization;

    const token = authHeader?.split(' ')[1];
    if (token) {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      req.user = user; // Attach user to request
    }
    next();
  }
}

export function getJwtMiddleware(
  jwtService: JwtService,
  userService: UserService,
) {
  const e = new JwtMiddleware(jwtService, userService);

  return e.run.bind(e);
}

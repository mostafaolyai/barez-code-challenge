import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../enums/user-role.enum';
import { User } from '../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!role) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user || !role.includes((user as User).role)) return false;

    return true;
  }
}

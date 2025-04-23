import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  protected readonly reflector: Reflector = new Reflector();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // await super.canActivate(context);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return false;
    }
    if (roles.includes(user.role)) return true;
    return false;
  }
}

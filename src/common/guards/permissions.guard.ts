import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import checkPermissionsUtil from '../../utils/checkPermissions.util';

@Injectable()
export class PermissionsGuard implements CanActivate {
  protected readonly reflector: Reflector = new Reflector();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // await super.canActivate(context);
    const permission = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return false;
    }
    return checkPermissionsUtil(user.permissions, permission);
  }
}

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: number[] | string[]) =>
  SetMetadata('roles', roles);

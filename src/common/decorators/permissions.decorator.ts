import { SetMetadata } from '@nestjs/common';

export const Permission = (permission: number) =>
  SetMetadata('permission', permission);

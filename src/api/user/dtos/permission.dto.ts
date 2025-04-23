import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserPermissions } from '../enums/permissions.enum';

export class PermissinDto {
  @IsEnum(UserPermissions)
  @ApiProperty()
  permission: UserPermissions;
}

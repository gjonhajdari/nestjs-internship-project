import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsUnique } from '../../../common/decorators/validation.decorator';
import { User } from '../entities/user.entity';
import { UserRoles } from '../enums/roles.enum';
import { UserGender } from '../enums/userGender.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  @Validate(IsUnique, [User])
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @Validate(IsUnique, [User])
  @ApiProperty()
  username: string;

  @IsEnum(UserGender)
  @IsOptional()
  @ApiProperty()
  gender: UserGender;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  timezone: string;

  @IsEnum(UserRoles)
  @IsOptional()
  @ApiProperty()
  role: number;
}

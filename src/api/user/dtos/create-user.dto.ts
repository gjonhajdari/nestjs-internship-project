import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @Validate(IsUnique, [User])
  @Transform(({ value }) => value.toLowerCase().replace(/\s/g, ''))
  @ApiProperty()
  email: string;

  @IsString()
  @Validate(IsUnique, [User])
  @Transform(({ value }) => value.toLowerCase().replace(/\s/g, ''))
  @ApiProperty()
  username: string;

  @IsEnum(UserGender)
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
  @ApiProperty()
  role: number;
}

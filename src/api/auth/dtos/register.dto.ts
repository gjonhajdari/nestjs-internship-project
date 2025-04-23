import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import {
  IsUnique,
  SameAs,
} from '../../../common/decorators/validation.decorator';
import { User } from '../../user/entities/user.entity';
import { UserGender } from '../../user/enums/userGender.enum';
import { UserRoles } from '../../user/enums/roles.enum';

export class RegisterDTO {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @Validate(IsUnique, [User])
  @ApiProperty()
  email: string;

  @IsString()
  @Validate(IsUnique, [User])
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,15}$/, {
    message:
      'Password must be 6 to 15 characters and must contain a letter, a number, a symbol, one upper case and ' +
      'lower case character.',
  })
  password: string;

  @SameAs('password', {
    message: "Password confirmation doesn't match.",
  })
  @IsNotEmpty()
  @ApiProperty()
  passwordConfirm: string;

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

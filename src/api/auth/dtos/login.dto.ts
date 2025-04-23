import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase().replace(/\s/g, ''))
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

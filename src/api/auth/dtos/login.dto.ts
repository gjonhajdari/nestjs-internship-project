import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    type: String,
    description: "User's email address",
    example: "test@email.com",
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().replace(/\s/g, ""))
  email: string;

  @ApiProperty({
    type: String,
    description: "User's password",
    example: "Password123#",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

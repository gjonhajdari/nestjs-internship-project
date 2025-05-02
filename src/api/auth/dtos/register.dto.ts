import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, Validate } from "class-validator";
import { IsUnique, SameAs } from "../../../common/decorators/validation.decorator";
import { User } from "../../user/entities/user.entity";

export class RegisterDTO {
  @IsString()
  @Matches(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, {
    message: "First name contains invalid characters (symbols, numbers, or punctuation).",
  })
  @ApiProperty({
    type: String,
    description: "User's first name",
    maxLength: 50,
    example: "John",
  })
  firstName: string;

  @IsString()
  @Matches(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, {
    message: "Last name contains invalid characters (symbols, numbers, or punctuation).",
  })
  @ApiProperty({
    type: String,
    description: "User's last name",
    maxLength: 50,
    example: "Doe",
  })
  lastName: string;

  @IsEmail()
  @Validate(IsUnique, [User])
  @ApiProperty({
    type: String,
    description: "User's email address",
    maxLength: 320,
    example: "johndoe@email.com",
  })
  email: string;

  // @IsString()
  // @Validate(IsUnique, [User])
  // @ApiProperty()
  // username: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*.?_-])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message:
      "Password must be 8 to 32 characters and must contain a letter, a number, a symbol, one upper case and " +
      "lower case character.",
  })
  @ApiProperty({
    type: String,
    description: "User's password",
    minLength: 8,
    maxLength: 32,
    example: "Password123.",
  })
  password: string;

  @SameAs("password", {
    message: "Password confirmation doesn't match.",
  })
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "Same password for confirmation. Must match the password field",
    minLength: 8,
    maxLength: 32,
    example: "Password123.",
  })
  passwordConfirm: string;

  // @IsEnum(UserGender)
  // @ApiProperty()
  // gender: UserGender;

  // @IsString()
  // @IsOptional()
  // @ApiProperty()
  // phone: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty()
  // timezone: string;

  // @IsEnum(UserRoles)
  // @ApiProperty()
  // role: number;
}

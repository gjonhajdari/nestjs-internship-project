import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { SameAs } from "../../../common/decorators/validation.decorator";

export class ForgotPasswordDto {
  @ApiProperty({
    type: String,
    description: "User's email address",
    example: "test@test.com",
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    description: "Old password",
    example: "Password123#",
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: "New entered password",
    example: "Password123#",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,15}$/, {
    message:
      "Password must be 6 to 15 characters and must contain a letter, a number, a symbol, one upper case and " +
      "lower case character.",
  })
  newPassword: string;

  @ApiProperty({
    type: String,
    description: "Password confirmation",
    example: "Password123#",
  })
  @SameAs("newPassword", {
    message: "Password confirmation doesn't match.",
  })
  @IsNotEmpty()
  @ApiProperty()
  newPasswordConfirm: string;
}

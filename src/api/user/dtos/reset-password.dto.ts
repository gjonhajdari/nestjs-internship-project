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
    description: "New entered password",
    example: "Password123#",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*.?_-])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message:
      "Password must be 8 to 32 characters and must contain a letter, a number, a symbol, one upper case and " +
      "lower case character.",
  })
  password: string;

  @ApiProperty({
    type: String,
    description: "Password confirmation",
    example: "Password123#",
  })
  @SameAs("password", {
    message: "Passwords do not match.",
  })
  @IsNotEmpty()
  @ApiProperty()
  passwordConfirm: string;
}

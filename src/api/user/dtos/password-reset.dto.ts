import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { SameAs } from "../../../common/decorators/validation.decorator";

export class ForgotPasswordDto {
  @ApiProperty()
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
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,15}$/, {
    message:
      "Password must be 6 to 15 characters and must contain a letter, a number, a symbol, one upper case and " +
      "lower case character.",
  })
  password: string;

  @ApiProperty({
    type: String,
    description: "Password confirmation",
    example: "Password123#",
  })
  @SameAs("password", {
    message: "Password confirmation doesn't match.",
  })
  @IsNotEmpty()
  @ApiProperty()
  passwordConfirm: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { SameAs } from "../../../common/decorators/validation.decorator";

export class UpdatePasswordDto {
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
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*.?_-])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/, {
    message:
      "Password must be 8 to 32 characters and must contain a letter, a number, a symbol, one upper case and " +
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

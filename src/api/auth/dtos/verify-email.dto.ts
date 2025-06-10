import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Code must be a number" })
  @Min(100000, { message: "Code must be 6 digits" })
  @Max(999999, { message: "Code must be 6 digits" })
  code: number;
}

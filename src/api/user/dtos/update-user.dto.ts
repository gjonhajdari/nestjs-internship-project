import { PartialType } from "@nestjs/swagger";
import { RegisterDTO } from "src/api/auth/dtos/register.dto";

export class UpdateUserDto extends PartialType(RegisterDTO) {}

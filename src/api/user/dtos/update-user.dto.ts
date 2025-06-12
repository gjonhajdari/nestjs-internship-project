import { PartialType } from "@nestjs/swagger";
import { RegisterDTO } from "../../auth/dtos/register.dto";

export class UpdateUserDto extends PartialType(RegisterDTO) {}

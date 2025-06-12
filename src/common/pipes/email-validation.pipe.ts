import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { isEmail } from "class-validator";

export class EmailValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isEmail(value)) {
      throw new BadRequestException("Email input should be a valid email address");
    }

    return value;
  }
}

import { SetMetadata } from "@nestjs/common";

export const TYPEORM_CUSTOM_REPOSITORY = "TYPEORM_CUSTOM_REPOSITORY";

export function CustomRepository(entity): ClassDecorator {
  return SetMetadata(TYPEORM_CUSTOM_REPOSITORY, entity);
}

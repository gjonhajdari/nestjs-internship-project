import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

export function catchKnownErrors(error: unknown): void {
  if (
    error instanceof NotFoundException ||
    error instanceof BadRequestException ||
    error instanceof ForbiddenException ||
    error instanceof UnauthorizedException ||
    error instanceof ConflictException
  ) {
    throw error;
  }
}

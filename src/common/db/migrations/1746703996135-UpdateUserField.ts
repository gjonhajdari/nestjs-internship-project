import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserField746703996135 implements MigrationInterface {
  name = "UpdateUserField1746703996135";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "hashed_reset_token" TO "hashed_refresh_token"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "hashed_refresh_token" TO "hashed_reset_token"`,
    );
  }
}

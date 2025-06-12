import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsVerifiedColumn1749472305853 implements MigrationInterface {
  name = "AddIsVerifiedColumn1749472305853";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
  }
}

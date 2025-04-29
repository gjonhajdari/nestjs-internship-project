import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateResetPassword1745852551876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("password-reset", "password_reset");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("password_reset", "password-reset");
  }
}

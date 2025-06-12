import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateYAxisNote1749028251470 implements MigrationInterface {
  name = "UpdateYAxisNote1749028251470";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT IF EXISTS "CHK_y_axis_constraint"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_y_axis_constraint" CHECK ("y_axis" >= 0 AND "y_axis" <= 2800)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT IF EXISTS "CHK_y_axis_constraint"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_y_axis_constraint" CHECK ("y_axis" >= 0 AND "y_axis" <= 5000)`,
    );
  }
}

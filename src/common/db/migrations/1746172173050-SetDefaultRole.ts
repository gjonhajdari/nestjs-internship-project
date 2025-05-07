import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultRole1746172173050 implements MigrationInterface {
  name = "SetDefaultRole1746172173050";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_users" ALTER COLUMN "role" SET DEFAULT 'participant'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "room_users" ALTER COLUMN "role" DROP DEFAULT`);
  }
}

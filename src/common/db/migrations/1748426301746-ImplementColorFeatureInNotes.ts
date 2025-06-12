import { MigrationInterface, QueryRunner } from "typeorm";

export class ImplementColorFeatureInNotes1748426301746 implements MigrationInterface {
  name = "ImplementColorFeatureInNotes1748426301746";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."note_color" AS ENUM('note-background-green', 'note-background-yellow', 'note-background-pink', 'note-background-blue', 'note-background-red')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "color" "public"."note_color" NOT NULL DEFAULT 'note-background-green'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "color"`);
    await queryRunner.query(`DROP TYPE "public"."note_color"`);
  }
}

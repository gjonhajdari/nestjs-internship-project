import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotePositionIndexes1750663449097 implements MigrationInterface {
  name = "AddNotePositionIndexes1750663449097";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "room_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "author_id" SET NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "idx_note_position" ON "notes" ("x_axis", "y_axis") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "author_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "room_id" DROP NOT NULL`);
    await queryRunner.query(`DROP INDEX "public"."idx_note_position"`);
  }
}

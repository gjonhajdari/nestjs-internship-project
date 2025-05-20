import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNoteVoteAudit1747729768753 implements MigrationInterface {
  name = "RemoveNoteVoteAuditEntity1747729768753";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_fc931afdd8cfdd360bc95ab780"`);
    await queryRunner.query(`ALTER TABLE "note_votes" DROP COLUMN "uuid"`);
    await queryRunner.query(`ALTER TABLE "note_votes" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "note_votes" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "note_votes" DROP COLUMN "deleted_at"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "note_votes" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "note_votes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_votes" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_votes" ADD "uuid" uuid NOT NULL DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fc931afdd8cfdd360bc95ab780" ON "note_votes" ("uuid") `,
    );
  }
}

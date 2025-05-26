import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoteVotesEntity1746710727467 implements MigrationInterface {
  name = "AddNoteVotesEntity1746710727467";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "note_votes" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, "note_id" integer, "room_id" integer, CONSTRAINT "UQ_635bfa7ded6cd53a3e7ce337c69" UNIQUE ("user_id", "room_id"), CONSTRAINT "PK_f2de5e991ff8a1ba9b31d546c52" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fc931afdd8cfdd360bc95ab780" ON "note_votes" ("uuid") `,
    );
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "x_axis" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "x_axis" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "y_axis" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "y_axis" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "note_votes" ADD CONSTRAINT "FK_18823bca5a5a7f9e55cca725172" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_votes" ADD CONSTRAINT "FK_67e3116ffaf763b9650c57de1d1" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_votes" ADD CONSTRAINT "FK_564d9e419701f2ed482b4c1e8fd" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note_votes" DROP CONSTRAINT "FK_564d9e419701f2ed482b4c1e8fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_votes" DROP CONSTRAINT "FK_67e3116ffaf763b9650c57de1d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_votes" DROP CONSTRAINT "FK_18823bca5a5a7f9e55cca725172"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "y_axis" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "y_axis" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "x_axis" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "x_axis" SET NOT NULL`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fc931afdd8cfdd360bc95ab780"`);
    await queryRunner.query(`DROP TABLE "note_votes"`);
  }
}

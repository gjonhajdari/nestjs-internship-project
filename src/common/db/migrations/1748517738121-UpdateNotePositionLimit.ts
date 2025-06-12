import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotePositionLimit1748517738121 implements MigrationInterface {
  name = "UpdateNotePositionLimit1748517738121";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note_votes" DROP CONSTRAINT "FK_67e3116ffaf763b9650c57de1d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "CHK_4f62fc30c3e0a197b786bc1849"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "CHK_dae3bbb998864182c25f2f636b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_81311f61dc6c18cf3930d020a3" CHECK ("x_axis" >= 0 AND "x_axis" <= 5000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_edc976fd7e2e84d36a9250d38a" CHECK ("y_axis" >= 0 AND "y_axis" <= 5000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_votes" ADD CONSTRAINT "FK_67e3116ffaf763b9650c57de1d1" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note_votes" DROP CONSTRAINT "FK_67e3116ffaf763b9650c57de1d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "CHK_edc976fd7e2e84d36a9250d38a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "CHK_81311f61dc6c18cf3930d020a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_dae3bbb998864182c25f2f636b" CHECK (((y_axis >= 0) AND (y_axis <= 50000)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_4f62fc30c3e0a197b786bc1849" CHECK (((x_axis >= 0) AND (x_axis <= 50000)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_votes" ADD CONSTRAINT "FK_67e3116ffaf763b9650c57de1d1" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

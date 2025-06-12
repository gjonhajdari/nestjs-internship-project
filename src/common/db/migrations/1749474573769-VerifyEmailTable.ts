import { MigrationInterface, QueryRunner } from "typeorm";

export class VerifyEmailTable1749474573769 implements MigrationInterface {
  name = "VerifyEmailTable1749474573769";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verify_email" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "code" integer NOT NULL, "expires_at" TIMESTAMP NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_ba00dd01ed7d5043871886ac1d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cb1ee385c176e238acf0e1fe13" ON "verify_email" ("uuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_email" ADD CONSTRAINT "FK_987aa6c2886f5e97a768b3b99d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verify_email" DROP CONSTRAINT "FK_987aa6c2886f5e97a768b3b99d4"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_cb1ee385c176e238acf0e1fe13"`);
    await queryRunner.query(`DROP TABLE "verify_email"`);
  }
}

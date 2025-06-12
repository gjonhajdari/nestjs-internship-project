import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivites1748961888904 implements MigrationInterface {
  name = "AddActivites1748961888904";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."activities_activity_type_enum" AS ENUM('added', 'updated', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."activities_resource_type_enum" AS ENUM('user', 'room', 'comment', 'note', 'vote')`,
    );
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "activity_type" "public"."activities_activity_type_enum" NOT NULL, "resource_type" "public"."activities_resource_type_enum" NOT NULL, "resource_id" uuid NOT NULL, "userId" integer NOT NULL, "roomId" integer NOT NULL, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1c92642081b03303d870a272d7" ON "activities" ("uuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_5a2cfe6f705df945b20c1b22c71" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_e7bd2d6b25da8dc48fc3ed75fa9" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_e7bd2d6b25da8dc48fc3ed75fa9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_5a2cfe6f705df945b20c1b22c71"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_1c92642081b03303d870a272d7"`);
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TYPE "public"."activities_resource_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."activities_activity_type_enum"`);
  }
}

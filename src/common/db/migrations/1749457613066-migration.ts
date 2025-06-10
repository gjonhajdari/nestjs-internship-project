import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749457613066 implements MigrationInterface {
  name = "Migration1749457613066";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "CHK_edc976fd7e2e84d36a9250d38a"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "CHK_y_axis_constraint"`);
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "resource_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "x_axis" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "x_axis" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "y_axis" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "y_axis" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TYPE "public"."activities_resource_type_enum" RENAME TO "activities_resource_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."activities_resource_type_enum" AS ENUM('user', 'room', 'comment', 'note', 'vote')`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ALTER COLUMN "resource_type" TYPE "public"."activities_resource_type_enum" USING "resource_type"::"text"::"public"."activities_resource_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."activities_resource_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_e7933da29f5f4cbe435fb8c872" CHECK ("y_axis" >= 0 AND "y_axis" <= 2800)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "CHK_e7933da29f5f4cbe435fb8c872"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."activities_resource_type_enum_old" AS ENUM('user', 'room', 'comment', 'note')`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ALTER COLUMN "resource_type" TYPE "public"."activities_resource_type_enum_old" USING "resource_type"::"text"::"public"."activities_resource_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."activities_resource_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."activities_resource_type_enum_old" RENAME TO "activities_resource_type_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "y_axis" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "y_axis" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "x_axis" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "notes" ALTER COLUMN "x_axis" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "resource_id"`);
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_y_axis_constraint" CHECK (((y_axis >= 0) AND (y_axis <= 2800)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "CHK_edc976fd7e2e84d36a9250d38a" CHECK (((y_axis >= 0) AND (y_axis <= 5000)))`,
    );
  }
}

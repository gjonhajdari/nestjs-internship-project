import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1745842205162 implements MigrationInterface {
  name = "InitialSchema1745842205162";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."room_users_role_enum" AS ENUM('host', 'participant')`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_users" ("role" "public"."room_users_role_enum" NOT NULL, "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "room_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16" PRIMARY KEY ("room_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooms" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying(100) NOT NULL, "slug" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_4a252a005ce573079b47a4f38e3" UNIQUE ("slug"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4653f18ce98647f3b746496a2a" ON "rooms" ("uuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" text, "total_votes" integer NOT NULL DEFAULT '0', "x_axis" integer NOT NULL DEFAULT '0', "y_axis" integer NOT NULL DEFAULT '0', "room_id" integer, "author_id" integer, CONSTRAINT "CHK_0bc231c351b2737dff09f54fb6" CHECK ("total_votes" >= 0), CONSTRAINT "CHK_4f62fc30c3e0a197b786bc1849" CHECK ("x_axis" >= 0 AND "x_axis" <= 50000), CONSTRAINT "CHK_dae3bbb998864182c25f2f636b" CHECK ("y_axis" >= 0 AND "y_axis" <= 50000), CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_098232e9365ec2dac9ef2f550f" ON "notes" ("uuid") `,
    );
    await queryRunner.query(`CREATE INDEX "idx_notes_room_id" ON "notes" ("room_id") `);
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying(150), "userId" integer NOT NULL, "noteId" integer NOT NULL, "parent_id" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_160936d39977f78f7789e0fb78" ON "comments" ("uuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(320) NOT NULL, "password" character varying(128) NOT NULL, "hashed_reset_token" character varying(128), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_951b8f1dfc94ac1d0301a14b7e" ON "users" ("uuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "password-reset" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "UQ_f1ad961ee6d0da067f483338751" UNIQUE ("token"), CONSTRAINT "REL_db45a9bc4faa806148d698e1ed" UNIQUE ("userId"), CONSTRAINT "PK_cb52c01cb0559a85c23755fb51d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_191d2096526f5d17b17e11fa0c" ON "password-reset" ("uuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "FK_443c187b06edbc18738b24aac34" FOREIGN KEY ("room_id") REFERENCES "rooms"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_746aecb872bb3765499a0a1911e" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_35b89a50cb9203dccff44136519" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_80933a403a9452ac4dd9b507ad6" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_d6f93329801a93536da4241e386" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password-reset" ADD CONSTRAINT "FK_db45a9bc4faa806148d698e1edd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password-reset" DROP CONSTRAINT "FK_db45a9bc4faa806148d698e1edd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_d6f93329801a93536da4241e386"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_80933a403a9452ac4dd9b507ad6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_35b89a50cb9203dccff44136519"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_746aecb872bb3765499a0a1911e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "FK_443c187b06edbc18738b24aac34"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_191d2096526f5d17b17e11fa0c"`);
    await queryRunner.query(`DROP TABLE "password-reset"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_951b8f1dfc94ac1d0301a14b7e"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_160936d39977f78f7789e0fb78"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP INDEX "public"."idx_notes_room_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_098232e9365ec2dac9ef2f550f"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4653f18ce98647f3b746496a2a"`);
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TABLE "room_users"`);
    await queryRunner.query(`DROP TYPE "public"."room_users_role_enum"`);
  }
}

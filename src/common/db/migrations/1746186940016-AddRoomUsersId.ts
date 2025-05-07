import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomUsersId1746186940016 implements MigrationInterface {
  name = "AddRoomUsersId1746186940016";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "room_users" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16"`,
    );

    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_6ba6f5ed6505258587bcf0e8db6" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "UQ_ba0fd8c93a7d079c1ebe5db4e16" UNIQUE ("room_id", "user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "UQ_ba0fd8c93a7d079c1ebe5db4e16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_6ba6f5ed6505258587bcf0e8db6"`,
    );

    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16" PRIMARY KEY ("room_id", "user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "room_users" DROP COLUMN "id"`);
  }
}

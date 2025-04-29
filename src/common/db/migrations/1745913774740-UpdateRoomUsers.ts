import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoomUsers1745913774740 implements MigrationInterface {
  name = "UpdateRoomUsers1745913774740";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "FK_443c187b06edbc18738b24aac34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ALTER COLUMN "joined_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_5421c55fb0212b9ff62fe9d3c89" PRIMARY KEY ("user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "room_users" DROP COLUMN "room_id"`);
    await queryRunner.query(`ALTER TABLE "room_users" ADD "room_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_5421c55fb0212b9ff62fe9d3c89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16" PRIMARY KEY ("user_id", "room_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_443c187b06edbc18738b24aac34" PRIMARY KEY ("room_id")`,
    );
    await queryRunner.query(`ALTER TABLE "room_users" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "room_users" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_443c187b06edbc18738b24aac34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16" PRIMARY KEY ("room_id", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "FK_443c187b06edbc18738b24aac34" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "FK_443c187b06edbc18738b24aac34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_443c187b06edbc18738b24aac34" PRIMARY KEY ("room_id")`,
    );
    await queryRunner.query(`ALTER TABLE "room_users" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "room_users" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_443c187b06edbc18738b24aac34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16" PRIMARY KEY ("user_id", "room_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_5421c55fb0212b9ff62fe9d3c89" PRIMARY KEY ("user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "room_users" DROP COLUMN "room_id"`);
    await queryRunner.query(`ALTER TABLE "room_users" ADD "room_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "room_users" DROP CONSTRAINT "PK_5421c55fb0212b9ff62fe9d3c89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "PK_ba0fd8c93a7d079c1ebe5db4e16" PRIMARY KEY ("room_id", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ALTER COLUMN "joined_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "FK_5421c55fb0212b9ff62fe9d3c89" FOREIGN KEY ("user_id") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users" ADD CONSTRAINT "FK_443c187b06edbc18738b24aac34" FOREIGN KEY ("room_id") REFERENCES "rooms"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/db/customBaseEntites/BaseEntity";
import { User } from "./user.entity";

@Entity("verify_email")
export class VerifyEmail extends BaseEntity {
  @Column()
  code: number;

  @Column({
    name: "expires_at",
  })
  expiresAt: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: "user_id",
  })
  user: User;
}

import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "../../../common/db/customBaseEntites/BaseEntity";
import { User } from "./user.entity";

@Entity("password_reset")
export class PasswordReset extends BaseEntity {
  @Column({ unique: true })
  token: string;

  @Column()
  expiresAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}

import { AuditEntity } from "src/common/db/customBaseEntites/AuditEntity";
import { Column, Entity } from "typeorm";

@Entity("rooms")
export class Room extends AuditEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: false, default: true })
  is_active: boolean;
}

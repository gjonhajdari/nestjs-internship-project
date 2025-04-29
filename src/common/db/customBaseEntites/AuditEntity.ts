import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { IAuditEntity } from "./interfaces/auditEntity.interface";

export abstract class AuditEntity extends BaseEntity implements IAuditEntity {
  @CreateDateColumn({ name: "created_at" })
  @ApiProperty({
    type: Date,
    description: "Timestamp when record was created",
    example: "2025-04-29T13:18:22.274Z",
  })
  createdAt: Date;

  @UpdateDateColumn({ name: "created_at" })
  @ApiProperty({
    type: Date,
    description: "Timestamp when record was updated",
    example: "2025-04-29T13:18:22.274Z",
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: "created_at" })
  @ApiProperty({
    type: Date,
    description: "Timestamp when record was deleted",
    example: "2025-04-29T13:18:22.274Z",
  })
  deletedAt: Date;
}

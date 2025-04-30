import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { IBaseEntity } from "./interfaces/baseEntity.interface";

export abstract class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ type: "uuid", generated: "uuid" })
  @Index({ unique: true })
  @ApiProperty({
    type: String,
    description: "Unique UUID identifier",
    example: "c475bcd7-a6a9-48e1-817e-6f5e15631246",
  })
  uuid: string;
}

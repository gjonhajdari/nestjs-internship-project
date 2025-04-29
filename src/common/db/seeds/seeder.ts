import { TypeOrmModule } from "@nestjs/typeorm";
import { seeder } from "nestjs-seeder";
import { DataSourceOptions } from "typeorm";
import { config } from "../dataSource/data-source.config";
import { NotesSeeder } from "./notes/create-notes.seed";
import { AddToRoomSeeder } from "./rooms/add-to-room.seed";
import { RoomsSeeder } from "./rooms/create-room.seed";
import { UsersSeeder } from "./users/create-users.seed";

seeder({
  imports: [TypeOrmModule.forRoot(config as DataSourceOptions)],
}).run([UsersSeeder, RoomsSeeder, AddToRoomSeeder, NotesSeeder]);

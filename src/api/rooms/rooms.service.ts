import { Injectable } from "@nestjs/common";
import { IRoomsService } from "./interfaces/rooms.service.interface";

@Injectable()
export class RoomsService implements IRoomsService {}

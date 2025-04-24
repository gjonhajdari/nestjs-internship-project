import { Controller } from "@nestjs/common";
import { IRoomsController } from "./interfaces/rooms.controller.interface";

@Controller("rooms")
export class RoomsController implements IRoomsController {}

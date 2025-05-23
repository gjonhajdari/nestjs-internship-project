import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { NotesService } from "src/api/notes/notes.service";
import { RoomUsers } from "src/api/rooms/entities/room-users.entity";
import { RoomRoles } from "src/api/rooms/enums/room-roles.enum";
import { User } from "src/api/user/entities/user.entity";
import { DataSource } from "typeorm";

@Injectable()
export class DeleteNoteGuard implements CanActivate {
  constructor(
    private readonly notesService: NotesService,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const noteId: string = request.params.noteId;

    const note = await this.notesService.findById(noteId);

    const isAuthor = note.author.id === user.id;

    const roomUser = await this.dataSource.getRepository(RoomUsers).findOne({
      where: { roomId: note.room.id, userId: user.id },
    });

    const isHost = roomUser?.role === RoomRoles.HOST;

    if (!isAuthor && !isHost) {
      throw new ForbiddenException("You are not allowed to delete this note.");
    }

    return true;
  }
}

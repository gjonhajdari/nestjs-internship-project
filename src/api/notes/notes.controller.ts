import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import { INotesController } from "./interfaces/notes.controller.interface";
import { NotesService } from "./notes.service";

// TODO: sockets
@ApiBearerAuth()
@ApiTags("Notes")
@UseInterceptors(ClassSerializerInterceptor)
@Controller("notes")
export class NotesController implements INotesController {
  constructor(private notesService: NotesService) {}

  @Get(":roomId")
  @HttpCode(HttpStatus.OK)
  async getAllNotesFromRoom(
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<Note[]> {
    return await this.notesService.findAll(roomId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNewNote(@Body() body: CreateNoteDto): Promise<Note> {
    return await this.notesService.create(body);
  }

  @Patch(":noteId")
  @HttpCode(HttpStatus.OK)
  async updateNote(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
    @Body() body: UpdateNoteDto,
  ): Promise<Note> {
    return await this.notesService.updateNote(noteId, body);
  }

  @Delete(":noteId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeNote(@Param("noteId", new ParseUUIDPipe()) noteId: string): Promise<void> {
    return await this.notesService.deleteNote(noteId);
  }

  @Post(":noteId/vote")
  @HttpCode(HttpStatus.CREATED)
  async addVote(@Param("noteId", new ParseUUIDPipe()) noteId: string): Promise<boolean> {
    return await this.notesService.addVote(noteId);
  }

  @Delete(":noteId/vote")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVote(@Param("noteId", new ParseUUIDPipe()) noteId: string): Promise<boolean> {
    return await this.notesService.removeVote(noteId);
  }
}

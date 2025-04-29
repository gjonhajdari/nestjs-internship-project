import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { INotesController } from "./interfaces/notes.controller.interface";

import { Note } from "./entities/note.entity";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { NotesService } from "./notes.service";

@ApiBearerAuth()
@ApiTags("Notes")
@UseInterceptors(ClassSerializerInterceptor)
@Controller("notes")
export class NotesController implements INotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllNotesFromRoom(): Promise<Note[]> {
    return {} as Note[];
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNewNote(@Body() body: CreateNoteDto): Promise<Note> {
    console.log(body);
    return {} as Note;
  }

  @Patch(":noteId")
  @HttpCode(HttpStatus.OK)
  async updateNote(
    @Param("noteId") noteId: string,
    @Body() body: UpdateNoteDto,
  ): Promise<Note> {
    console.log(noteId, body);
    return {} as Note;
  }

  @Delete(":noteId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeNote(@Param("noteId") noteId: string): Promise<void> {
    console.log(noteId);
  }

  @Post(":noteId/vote")
  @HttpCode(HttpStatus.CREATED)
  async addVote(@Param("noteId") noteId: string): Promise<boolean> {
    console.log(noteId);
    return true;
  }

  @Delete(":noteId/vote")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVote(@Param("noteId") noteId: string): Promise<boolean> {
    console.log(noteId);
    return false;
  }
}

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

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
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
  @ApiOperation({
    summary: "Get all notes from a specific room",
    description:
      "Retrieves all notes associated with the provided room ID. Returns an empty array if no notes exist.",
  })
  @ApiOkResponse({
    description: "A 200 response if the notes from the specific room are found successfully",
    type: Note,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Param("roomId", new ParseUUIDPipe()) roomId: string): Promise<Note[]> {
    return await this.notesService.findNotesFromRoom(roomId);
  }

  @Post()
  @ApiOperation({
    summary: "Create a new note",
    description: "Creates a new note in the specified room with optional content.",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the note is created successfully",
    type: Note,
  })
  @ApiNotFoundResponse({ description: "A 404 error if the room doesn't exist" })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateNoteDto): Promise<Note> {
    return await this.notesService.createNote(body);
  }

  @Patch(":noteId")
  @ApiOperation({
    summary: "Update note",
    description:
      "Updates an existing note's content or coordinates. Returns the updated note.",
  })
  @ApiOkResponse({
    description: "A 200 response if the note is updated successfully",
    type: Note,
  })
  @ApiNotFoundResponse({ description: "A 404 error if the note doesn't exist" })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
    @Body() body: UpdateNoteDto,
  ): Promise<Note> {
    return await this.notesService.updateNote(noteId, body);
  }

  @Delete(":noteId")
  @ApiOperation({
    summary: "Delete note",
    description: "Deletes the note with the specified ID. Returns no content if successful.",
  })
  @ApiNoContentResponse({
    description: "A 204 response if the note is deleted successfully",
  })
  @ApiNotFoundResponse({ description: "A 404 error if the note doesn't exist" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("noteId", new ParseUUIDPipe()) noteId: string): Promise<void> {
    return await this.notesService.deleteNote(noteId);
  }

  @Post(":noteId/vote")
  @ApiOperation({
    summary: "Add vote to note",
    description:
      "Increments the vote count on the specified note by 1. Returns true if successful.",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the vote is added successfully",
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: "A 404 error if the note doesn't exist" })
  @HttpCode(HttpStatus.CREATED)
  async addVote(@Param("noteId", new ParseUUIDPipe()) noteId: string): Promise<boolean> {
    return await this.notesService.addVote(noteId);
  }

  @Delete(":noteId/vote")
  @ApiOperation({
    summary: "Remove vote from note",
    description:
      "Decrements the vote count on the specified note by 1. Returns true if successful",
  })
  @ApiNoContentResponse({
    description: "A 204 response if the vote is removed successfully",
  })
  @ApiNotFoundResponse({ description: "A 404 error if the note doesn't exist" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVote(@Param("noteId", new ParseUUIDPipe()) noteId: string): Promise<boolean> {
    return await this.notesService.removeVote(noteId);
  }
}

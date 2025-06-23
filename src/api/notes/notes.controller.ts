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
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { UnprocessableEntityResponse } from "src/common/interfaces/responses/unprocessable-entity.response";
import { GetCurrentUser } from "../../common/decorators/get-current-user.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { IResponseStatus } from "../../common/interfaces/ResponseStatus.interface";
import { BadRequestResponse } from "../../common/interfaces/responses/bad-request.response";
import { DeletedResponse } from "../../common/interfaces/responses/deleted.response";
import { ForbiddenResponse } from "../../common/interfaces/responses/forbidden.response";
import { InternalErrorResponse } from "../../common/interfaces/responses/internal-error.response";
import { NotFoundResponse } from "../../common/interfaces/responses/not-found.response";
import { UnauthorizedResponse } from "../../common/interfaces/responses/unauthorized.response";
import { User } from "../user/entities/user.entity";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { ExportNotesDto } from "./dtos/export-notes.dto";
import { NotesViewportDto } from "./dtos/notes-viewport.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import {
  IAddVoteNote,
  ICreateNote,
  INoteVote,
  IRemoveVoteNote,
  IUpdateNote,
} from "./interfaces/notes-response.interface";
import { INotesController } from "./interfaces/notes.controller.interface";
import { NotesService } from "./notes.service";

@ApiBearerAuth()
@ApiTags("Notes")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
@Controller("notes")
export class NotesController implements INotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get("viewport")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get all notes from a specific room by viewport",
    description: "Retrieves all notes associated with the provided room Id.",
  })
  @ApiOkResponse({
    description: "A 200 response if the notes from the specific room are found successfully",
    type: Note,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 response if no room is found",
    type: NotFoundResponse,
  })
  public async findAll(
    @Query("roomId", new ParseUUIDPipe()) roomId: string,
    @Query() bounds: NotesViewportDto,
  ): Promise<Partial<Note>[]> {
    const notes = await this.notesService.getNotesInViewport(roomId, bounds);
    return notes;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new note",
    description: "Creates a new note in the specified room",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the note is created successfully",
    type: Note,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the room doesn't exist",
    type: NotFoundResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "A 500 error if trying to create the note",
    type: InternalErrorResponse,
  })
  public async create(
    @Body() body: CreateNoteDto,
    @GetCurrentUser() currentUser: User,
  ): Promise<ICreateNote> {
    return await this.notesService.createNote(body, currentUser);
  }

  @Patch(":noteId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update note",
    description: "Updates an existing note's content or coordinates. Returns the updated note",
  })
  @ApiOkResponse({
    description: "A 200 response if the note is updated successfully",
    type: Note,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the note doesn't exist",
    type: NotFoundResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "A 500 error if trying to update existing note",
    type: InternalErrorResponse,
  })
  async update(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
    @Body() body: UpdateNoteDto,
    @GetCurrentUser() currentUser: User,
  ): Promise<IUpdateNote> {
    return await this.notesService.updateNote(noteId, body, currentUser);
  }

  // @UseGuards(DeleteNoteGuard)
  @Delete(":noteId")
  @ApiOperation({
    summary: "Delete note",
    description:
      "Deletes the note with the specified ID. Returns a status object indicating success",
  })
  @ApiOkResponse({
    description: "A 200 response if the note is deleted successfully",
    type: DeletedResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiForbiddenResponse({
    description: "A 403 error if the user is not authorized to delete the note",
    type: ForbiddenResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the note doesn't exist",
    type: NotFoundResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "A 500 error if trying to remove existing note",
    type: InternalErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
  ): Promise<IResponseStatus> {
    return await this.notesService.deleteNote(noteId);
  }

  @Get("votes")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get all votes for a specific note",
    description:
      "Returns a list of users who have voted on the note, including their UUID, first name, and last name.",
  })
  @ApiOkResponse({
    description: "Votes retrieved successfully",
    type: [Object],
  })
  @ApiNotFoundResponse({
    description: "Note not found for the given ID",
    type: NotFoundResponse,
  })
  public async findVotes(
    @Query("noteId", new ParseUUIDPipe()) noteId: string,
  ): Promise<INoteVote[]> {
    return this.notesService.findAllNoteVotes(noteId);
  }

  @Post(":noteId/vote")
  @ApiOperation({
    summary: "Add vote to note",
    description:
      "Increments the vote count on the specified note by one, if the user already voted for another note in the same room, the vote is switched.",
  })
  @ApiCreatedResponse({
    description: "Vote added or switched successfully",
    schema: {
      example: {
        success: true,
        message: "John added a vote!",
        voteSwitched: false,
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "A 400 error if missing user or room information & if the user has already voted in the same room",
    type: BadRequestResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the note doesn't exist",
    type: NotFoundResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "A 500 error if trying to add a vote to the note",
    type: InternalErrorResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  public async addVote(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
    @GetCurrentUser() currentUser: User,
  ): Promise<IAddVoteNote> {
    return await this.notesService.addVote(noteId, currentUser);
  }

  @Delete(":noteId/vote")
  @ApiOperation({
    summary: "Remove vote from note",
    description:
      "Decrements the vote count on the specified note by 1, returns success & message",
  })
  @ApiOkResponse({
    description: "Vote removed successfully",
    schema: {
      example: {
        success: true,
        message: "John removed vote!",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "A 400 error if missing user or room information",
    type: BadRequestResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description:
      "A 404 error if the note is not found or if the user has not voted in the room",
    type: NotFoundResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "A 500 error if trying to remove the vote from the note",
    type: InternalErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  public async removeVote(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
    @GetCurrentUser() currentUser: User,
  ): Promise<IRemoveVoteNote> {
    return await this.notesService.removeVote(noteId, currentUser);
  }

  @ApiOperation({
    summary: "Export notes",
    description:
      "Exports all notes from a specific room in the requested format (JSON, CSV, XML, or PDF). Returns a file to be downloaded.",
  })
  @ApiOkResponse({
    description: "A 200 response with the exported notes file",
  })
  @ApiBadRequestResponse({
    description: "A 400 error if the export format is invalid",
    type: BadRequestResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the room is not found",
    type: NotFoundResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: "A 422 error if there are no notes to export",
    type: UnprocessableEntityResponse,
  })
  @Get("export")
  public async exportNotes(@Query() query: ExportNotesDto, @Res() res: Response) {
    const { buffer, filename, mimeType } = await this.notesService.exportNotes(query);

    res.set({
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  }

  @Get("room/:roomId/current-winner")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get the notes with the highest votes in a room",
    description:
      "Returns an array of note UUIDs that share the highest vote count in the specified room",
  })
  @ApiOkResponse({
    description: "Winning note UUID(s) returned successfully",
    schema: {
      example: [
        { uuid: "4e367c65-0046-4361-b5d1-2a440c9fa7d4" },
        { uuid: "8be55f6b-d9a0-4c6c-8abf-834b6e1ad314" },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: "A 404 error if no notes with votes greater than zero are found",
    type: NotFoundResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  public async noteWinner(
    @Param("roomId", new ParseUUIDPipe()) roomId: string,
  ): Promise<{ uuid: string }[]> {
    return this.notesService.getCurrentNoteVoteWinners(roomId);
  }

  @Get(":noteId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get a single note by UUID",
    description: "Returns the note by the given UUID.",
  })
  @ApiOkResponse({
    description: "A 200 response if the note is found",
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the note is not found",
    type: NotFoundResponse,
  })
  public async getOne(@Param("noteId", new ParseUUIDPipe()) noteId: string): Promise<Note> {
    return this.notesService.findById(noteId);
  }
}

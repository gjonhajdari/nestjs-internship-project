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
} from "@nestjs/swagger";
import { InternalErrorResponse } from "src/common/interfaces/responses/internal-error.response";
import { GetCurrentUser } from "../../common/decorators/get-current-user.decorator";
import { DeleteNoteGuard } from "../../common/guards/delete-note.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { IResponseStatus } from "../../common/interfaces/ResponseStatus.interface";
import { BadRequestResponse } from "../../common/interfaces/responses/bad-request.response";
import { DeletedResponse } from "../../common/interfaces/responses/deleted.response";
import { ForbiddenResponse } from "../../common/interfaces/responses/forbidden.response";
import { NotFoundResponse } from "../../common/interfaces/responses/not-found.response";
import { UnauthorizedResponse } from "../../common/interfaces/responses/unauthorized.response";
import { User } from "../user/entities/user.entity";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import {
  IAddVoteNote,
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

  @Get()
  @ApiOperation({
    summary: "Get all notes from a specific room",
    description:
      "Retrieves all notes associated with the provided room ID. Returns an empty array if no notes exist",
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
  @HttpCode(HttpStatus.OK)
  async findAll(@Query("roomId", new ParseUUIDPipe()) roomId: string): Promise<Note[]> {
    return await this.notesService.findNotesWithVotesFromRoom(roomId);
  }

  @Post()
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
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: CreateNoteDto,
    @GetCurrentUser() currentUser: User,
  ): Promise<Note> {
    return await this.notesService.createNote(body, currentUser);
  }

  @Patch(":noteId")
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
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
    @Body() body: UpdateNoteDto,
    @GetCurrentUser() currentUser: User,
  ): Promise<IUpdateNote> {
    return await this.notesService.updateNote(noteId, body, currentUser);
  }

  @UseGuards(DeleteNoteGuard)
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
  async delete(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
  ): Promise<IResponseStatus> {
    return await this.notesService.deleteNote(noteId);
  }

  @Post(":noteId/vote")
  @ApiOperation({
    summary: "Add vote to note",
    description:
      "Increments the vote count on the specified note by 1, returns a success, message & switched vote status",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the vote is added successfully",
    type: Boolean,
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
  async addVote(
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
    description: "A 200 response if the vote is removed successfully",
    type: Boolean,
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
  async removeVote(
    @Param("noteId", new ParseUUIDPipe()) noteId: string,
    @GetCurrentUser() currentUser: User,
  ): Promise<IRemoveVoteNote> {
    return await this.notesService.removeVote(noteId, currentUser);
  }
}

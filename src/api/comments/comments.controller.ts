import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { GetCurrentUser } from "src/common/decorators/get-current-user.decorator";
import { IDeleteStatus } from "../../common/interfaces/DeleteStatus.interface";
import { BadRequestResponse } from "../../common/interfaces/responses/bad-request.response";
import { DeletedResponse } from "../../common/interfaces/responses/deleted.response";
import { NotFoundResponse } from "../../common/interfaces/responses/not-found.response";
import { UnauthorizedResponse } from "../../common/interfaces/responses/unauthorized.response";
import { User } from "../user/entities/user.entity";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { UpdateCommentDto } from "./dtos/update-comment.dto";
import { Comment } from "./entities/comment.entity";
import { ICommentsController } from "./interfaces/comments.controller.interface";

@ApiBearerAuth()
@ApiTags("Comments")
@Controller("comments")
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController implements ICommentsController {
  constructor(private commentsService: CommentsService) {}

  @ApiOperation({
    summary: "Get all comments for a note",
    description: "Retrieves all comments associated with the specified note ID",
  })
  @ApiOkResponse({
    description: "A 200 response if the comments are found successfully",
    type: Comment,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the note doesn't exist",
    type: NotFoundResponse,
  })
  @Get()
  async findAll(@Query("noteId", new ParseUUIDPipe()) noteId: string): Promise<Comment[]> {
    return this.commentsService.findComments(noteId);
  }

  @ApiOperation({
    summary: "Create a new comment",
    description: "Creates a new comment associated with the specified note ID",
  })
  @ApiCreatedResponse({
    description: "A 201 response if the comment is created successfully",
    type: Comment,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the note doesn't exist",
    type: NotFoundResponse,
  })
  @Post()
  async create(
    @GetCurrentUser() user: User,
    @Body() body: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.createComment(user.uuid, body);
  }

  @ApiOperation({
    summary: "Update a comment",
    description: "Updates an existing comment associated with the specified comment ID",
  })
  @ApiOkResponse({
    description: "A 200 response if the comment is updated successfully",
    type: Comment,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the comment doesn't exist",
    type: NotFoundResponse,
  })
  @ApiBadRequestResponse({
    description: "A 400 error if the request body is invalid",
    type: BadRequestResponse,
  })
  @Patch(":commentId")
  async update(
    @GetCurrentUser() user: User,
    @Param("commendId") commendId: string,
    @Body() body: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.updateComment(user.uuid, commendId, body);
  }

  @ApiOperation({
    summary: "Delete a comment",
    description: "Deletes an existing comment associated with the specified comment ID",
  })
  @ApiOkResponse({
    description: "A 200 response if the comment is deleted successfully",
    type: DeletedResponse,
  })
  @ApiNotFoundResponse({
    description: "A 404 error if the comment doesn't exist",
    type: NotFoundResponse,
  })
  @ApiUnauthorizedResponse({
    description: "A 401 error if no bearer token is provided",
    type: UnauthorizedResponse,
  })
  @Delete(":commentId")
  async delete(commentid: string): Promise<IDeleteStatus> {
    throw new Error("Method not implemented.");
  }
}

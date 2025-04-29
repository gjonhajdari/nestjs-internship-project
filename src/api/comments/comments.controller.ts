import { Controller, Get, ParseUUIDPipe, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { UpdateCommentDto } from "./dtos/update-comment.dto";
import { Comment } from "./entities/comment.entity";
import { ICommentsController } from "./interfaces/comments.controller.interface";

@ApiBearerAuth()
@ApiTags("Comments")
@Controller("comments")
export class CommentsController implements ICommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  findAll(@Query("noteId", new ParseUUIDPipe()) noteId: string): Promise<Comment[]> {
    return this.commentsService.findComments(noteId);
  }

  create(userId: string, body: CreateCommentDto): Promise<Comment> {
    throw new Error("Method not implemented.");
  }

  update(commendId: string, body: UpdateCommentDto): Promise<Comment> {
    throw new Error("Method not implemented.");
  }

  delete(commentid: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

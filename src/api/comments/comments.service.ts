import { Injectable, NotFoundException } from "@nestjs/common";
import { NotesService } from "../notes/notes.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { UpdateCommentDto } from "./dtos/update-comment.dto";
import { Comment } from "./entities/comment.entity";
import { ICommentsService } from "./interfaces/comments.service.interface";
import { CommentsRepository } from "./repository/comments.repository";

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private notesService: NotesService,
  ) {}

  async findById(commentId: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { uuid: commentId } });

    if (!comment) throw new NotFoundException("Comment doesn't exist");

    return comment;
  }

  async findComments(noteId: string): Promise<Comment[]> {
    const note = await this.notesService.findById(noteId);
    return this.commentsRepository.find({ where: { note: { id: note.id } } });
  }

  createComment(payload: CreateCommentDto): Promise<Comment> {
    throw new Error("Method not implemented.");
  }

  updateComment(commentId: string, payload: UpdateCommentDto): Promise<Comment> {
    throw new Error("Method not implemented.");
  }

  deleteComment(commentId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

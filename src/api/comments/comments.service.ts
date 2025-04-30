import { Injectable, NotFoundException } from "@nestjs/common";
import { IDeleteStatus } from "src/common/interfaces/DeleteStatus.interface";
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

  /**
   * Gets a comment from it's given UUID
   *
   * @param commentId - Unique comment UUID
   * @returns Promise that resolves to the found comment
   * @throws {NotFoundException} - If no comment is found with the given UUID
   */
  async findById(commentId: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { uuid: commentId } });

    if (!comment) throw new NotFoundException("Comment doesn't exist");

    return comment;
  }

  /**
   * Gets all comments in a given note
   *
   * @param noteId - Unique note UUID
   * @returns Promise that resolves to the found comments array
   * @throws {NotFoundException} - If no note is found with the given UUID
   */
  async findComments(noteId: string): Promise<Comment[]> {
    const note = await this.notesService.findById(noteId);
    return this.commentsRepository.find({ where: { note: { id: note.id } } });
  }

  /**
   * Creates a new comment and saves it in the database
   *
   * @param payload - The required data to create a comment
   * @returns Promise that resolves to the created comment
   * @throws {NotFoundException} - If no note is found with the given UUID
   */
  async createComment(payload: CreateCommentDto): Promise<Comment> {
    const note = await this.notesService.findById(payload.noteId);
    const comment = this.commentsRepository.create(payload);
    comment.note = note;

    return this.commentsRepository.save(comment);
  }

  /**
   * Updates a comment in the database with the new given attributes
   *
   * @param commentId - The unique UUID of the comment
   * @param payload - Given attributes of the comment to update
   * @returns Promise that resolves to the updated comment
   * @throws {NotFoundException} - If no comment is found with the given UUID
   */
  async updateComment(commentId: string, payload: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findById(commentId);
    return this.commentsRepository.save({ ...comment, ...payload });
  }

  /**
   * Deletes a comment from the database
   *
   * @param commentId - The unique UUID of the comment
   * @throws {NotFoundException} - If no comment with the given UUID is found
   */
  async deleteComment(commentId: string): Promise<IDeleteStatus> {
    const comment = await this.findById(commentId);
    await this.commentsRepository.remove(comment);

    return {
      success: true,
      resourceType: "comment",
      resourceId: comment.uuid,
      message: "Comment deleted successfully",
      timestamp: new Date(),
    };
  }
}

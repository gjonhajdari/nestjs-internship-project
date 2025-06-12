import { tryCatch } from "@maxmorozoff/try-catch-tuple";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ResourceType } from "../../common/enums/resource-type.enum";
import { IResponseStatus } from "../../common/interfaces/ResponseStatus.interface";
import { NotesService } from "../notes/notes.service";
import { UsersService } from "../user/users.service";
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
    private usersService: UsersService,
  ) {}

  /**
   * Gets a comment from it's given UUID
   *
   * @param commentId - Unique comment UUID
   * @returns Promise that resolves to the found comment
   * @throws {NotFoundException} - If no comment is found with the given UUID
   * @throws {InternalServerErrorException} - If there was an error processing the request
   */
  async findById(commentId: string, relations?: string[]): Promise<Comment> {
    const [comment, error] = await tryCatch(
      this.commentsRepository.findOne({ where: { uuid: commentId }, relations }),
    );

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    if (!comment) throw new NotFoundException("Comment doesn't exist");

    return comment;
  }

  /**
   * Gets all comments in a given note
   *
   * @param noteId - Unique note UUID
   * @returns Promise that resolves to the found comments array
   * @throws {NotFoundException} - If no note is found with the given UUID
   * @throws {InternalServerErrorException} - If there was an error processing the request
   */
  async findComments(noteId: string): Promise<Comment[]> {
    const note = await this.notesService.findById(noteId);

    const [comments, error] = await tryCatch(
      this.commentsRepository.find({
        where: { note: { id: note.id } },
        relations: ["user", "parent"],
      }),
    );

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return comments;
  }

  /**
   * Creates a new comment and saves it in the database
   *
   * @param payload - The required data to create a comment
   * @returns Promise that resolves to the created comment
   * @throws {NotFoundException} - If no note is found with the given UUID
   * @throws {NotFoundException} - If no user is found with the given UUID
   * @throws {InternalServerErrorException} - If there was an error processing the request
   */
  async createComment(userId: string, payload: CreateCommentDto): Promise<Comment> {
    const note = await this.notesService.findById(payload.noteId);
    const user = await this.usersService.findOne(userId);
    const comment = this.commentsRepository.create(payload);
    let parentComment: Comment;

    if (payload.parentId) parentComment = await this.findById(payload.parentId);

    comment.note = note;
    comment.user = user;
    comment.parent = parentComment;

    const [newComment, error] = await tryCatch(this.commentsRepository.save(comment));

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return newComment;
  }

  /**
   * Updates a comment in the database with the new given attributes
   *
   * @param commentId - The unique UUID of the comment
   * @param payload - Given attributes of the comment to update
   * @returns Promise that resolves to the updated comment
   * @throws {NotFoundException} - If no comment is found with the given UUID
   * @throws {BadRequestException} - If the user is trying to edit someone else's comment
   * @throws {InternalServerErrorException} - If there was an error processing the request
   */
  async updateComment(
    userId: string,
    commentId: string,
    payload: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findById(commentId, ["user"]);
    console.log(comment);

    if (userId !== comment.user.uuid)
      throw new BadRequestException("Can't edit someone else's comment");

    const [updatedComment, error] = await tryCatch(
      this.commentsRepository.save({ ...comment, ...payload }),
    );

    if (error)
      throw new InternalServerErrorException("There was an error processing your request");

    return updatedComment;
  }

  /**
   * Deletes a comment from the database
   *
   * @param commentId - The unique UUID of the comment
   * @throws {NotFoundException} - If no comment with the given UUID is found
   */
  async deleteComment(commentId: string): Promise<IResponseStatus> {
    const comment = await this.findById(commentId);

    const [replies, repliesError] = await tryCatch(
      this.commentsRepository.find({ where: { parent: { id: comment.id } } }),
    );

    if (repliesError)
      throw new InternalServerErrorException("There was an error processing your request");

    const [_, deleteError] = await tryCatch(
      Promise.all([
        this.commentsRepository.softRemove(comment),
        this.commentsRepository.softRemove(replies),
      ]),
    );

    if (deleteError)
      throw new InternalServerErrorException("There was an error deleting your comment");

    return {
      success: true,
      resourceType: ResourceType.COMMENT,
      resourceId: comment.uuid,
      message: "Comment deleted successfully",
      timestamp: new Date(),
    };
  }
}

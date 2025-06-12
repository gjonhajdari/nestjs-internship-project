import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { In } from "typeorm";
import { Comment } from "../../../../api/comments/entities/comment.entity";
import { Note } from "../../../../api/notes/entities/note.entity";
import { User } from "../../../../api/user/entities/user.entity";
import AppDataSource from "../../dataSource/data-source.initialize";

@Injectable()
export class CommentsSeeder implements Seeder {
  async seed(): Promise<any> {
    const notesRepository = AppDataSource.getRepository(Note);
    const commentsRepository = AppDataSource.getRepository(Comment);
    const usersRepository = AppDataSource.getRepository(User);

    const notes = await notesRepository.find();
    const users = await usersRepository.find();

    const comments = commentsRepository.create([
      { note: notes[0], content: "test", user: users[0] },
      { note: notes[0], content: "test-2", user: users[1] },
      { note: notes[1], content: "test-3", user: users[3] },
      { note: notes[1], content: "test-4", user: users[4] },
      { note: notes[2], content: "test-5", user: users[4] },
      { note: notes[2], content: "test-6", user: users[2] },
    ]);

    const createdComments = await commentsRepository.save(comments);

    const replies = commentsRepository.create([
      {
        parent: createdComments[0],
        note: createdComments[0].note,
        content: "reply to 'test'",
        user: users[5],
      },
      {
        parent: createdComments[2],
        note: createdComments[2].note,
        content: "reply to 'test-3'",
        user: users[6],
      },
      {
        parent: createdComments[5],
        note: createdComments[5].note,
        content: "reply to 'test-6'",
        user: users[1],
      },
    ]);

    await commentsRepository.save(replies);
  }

  async drop(): Promise<any> {
    const commentsRepository = AppDataSource.getRepository(Comment);

    const ids = [1, 2, 3, 4, 5, 6];

    await commentsRepository.delete({ id: In(ids) });
  }
}

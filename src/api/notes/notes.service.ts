import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";
import { Note } from "./entities/note.entity";
import { INotesService } from "./interfaces/notes.service.interface";

@Injectable()
export class NotesService implements INotesService {
  constructor(@InjectRepository(Note) private notesRepository: Repository<Note>) {}

  async findById(noteId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { uuid: noteId } });

    if (!note) throw new NotFoundException("Note does not exist");

    return note;
  }

  async findAll(roomId: string): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { room: { uuid: roomId } },
      relations: ["room"],
    });
  }

  async create(body: CreateNoteDto): Promise<Note> {
    throw new Error("Method not implemented.");
  }

  async updateNote(noteId: string, body: UpdateNoteDto): Promise<Note> {
    throw new Error("Method not implemented.");
  }
  async removeNote(noteId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async addVote(noteId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async removeVote(noteId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

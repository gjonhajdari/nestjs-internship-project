import { Injectable } from "@nestjs/common";
import jsPDF from "jspdf";
import { Room } from "../../rooms/entities/room.entity";
import { Note } from "../entities/note.entity";

@Injectable()
export class ParsingProvider {
  /**
   * Parses notes data into a JSON format suitable for export.
   *
   * @param room - The room from which notes are being exported
   * @param data - The notes data to be parsed
   * @returns An object containing the room title, export date, and parsed notes
   */
  parseJson(room: Room, data: Note[]): string {
    const parsedNotes = data.map((el) => {
      return {
        content: el.content,
        author: `${el.author.firstName} ${el.author.lastName}`,
        votes: el.totalVotes,
        xAxis: el.xAxis,
        yAxis: el.yAxis,
      };
    });

    return JSON.stringify(
      {
        room: room.title,
        exportedAt: new Date(),
        notes: parsedNotes,
      },
      null,
      2,
    );
  }

  /**
   * Generates a CSV string from the notes data.
   *
   * @param notes - The notes to be converted to CSV format
   * @returns A string representing the notes in CSV format
   */
  parseCSV(notes: Note[]): string {
    const headers = "Content,Author,Votes,X Axis,Y Axis";

    const rows = notes.map((note) => {
      const content = `${note.content}`;
      const author = `${note.author.firstName} ${note.author.lastName}`;
      const votes = note.totalVotes;
      const xAxis = note.xAxis;
      const yAxis = note.yAxis;

      return `${content},${author},${votes},${xAxis},${yAxis}`;
    });

    return [headers, ...rows].join("\n");
  }

  /**
   * Generates an XML string from the notes data.
   *
   * @param room - The room from which notes are being exported
   * @param notes - The notes to be converted to XML format
   * @returns A string representing the notes in XML format
   */
  parseXML(room: Room, notes: Note[]): string {
    const escapedRoomTitle = this.escapeXml(room.title);
    const exportedAt = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += "<export>\n";
    xml += `  <room>${escapedRoomTitle}</room>\n`;
    xml += `  <exportedAt>${exportedAt}</exportedAt>\n`;
    xml += "  <notes>\n";

    for (const note of notes) {
      const content = this.escapeXml(note.content);
      const author = this.escapeXml(`${note.author.firstName} ${note.author.lastName}`);

      xml += "    <note>\n";
      xml += `      <content>${content}</content>\n`;
      xml += `      <author>${author}</author>\n`;
      xml += `      <votes>${note.totalVotes}</votes>\n`;
      xml += `      <xAxis>${note.xAxis}</xAxis>\n`;
      xml += `      <yAxis>${note.yAxis}</yAxis>\n`;
      xml += "    </note>\n";
    }

    xml += "  </notes>\n";
    xml += "</export>";

    return xml;
  }

  /**
   * Escapes special characters in a string to make it safe for XML output.
   *
   * @param unsafe - The string to be escaped
   * @returns A string with special characters replaced by their XML-safe equivalents
   */
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Generates a PDF buffer from the notes data.
   *
   * @param room - The room from which notes are being exported
   * @param notes - The notes to be converted to PDF format
   * @returns A Buffer containing the PDF data
   */
  parsePDF(room: Room, notes: Note[]): string {
    const doc = new jsPDF();

    // Set up the document
    doc.setFontSize(20);
    doc.text(`Exported data for "${room.title}"`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Total Notes: ${notes.length}`, 20, 45);

    // Add a line separator
    doc.line(20, 55, 190, 55);

    let yPosition = 70;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 30;

    notes.forEach((note, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - marginBottom) {
        doc.addPage();
        yPosition = 20;
      }

      // Note header (using note content)
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");

      const content = note.content || "No content";
      const maxWidth = 170;
      const contentLines = doc.splitTextToSize(content, maxWidth);

      doc.text(contentLines, 20, yPosition);
      yPosition += contentLines.length * 6;

      // Author and votes info
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");

      yPosition += 5;
      const author = `${note.author.firstName} ${note.author.lastName}`;
      doc.text(`Author: ${author}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Votes: ${note.totalVotes}`, 20, yPosition);
      yPosition += 7;

      // Add separator line between notes
      if (index < notes.length - 1) {
        yPosition += 5;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
      }
    });

    return doc.output("datauristring").split(",")[1];
  }
}

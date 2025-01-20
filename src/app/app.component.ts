import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  notes: { id: number; title: string; content: string }[] = [];
  selectedNote: { id: number; title: string; content: string } | null = null;
  newNote = { title: '', content: '' };

  private apiUrl = 'http://localhost:3000/api/notes'; // Backend API URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadNotes();
  }

  // Fetch all notes from the backend
  loadNotes() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.notes = data;
      },
      (error) => {
        console.error('Error fetching notes:', error);
      }
    );
  }

  // Add a new note
  addNote() {
    if (this.newNote.title && this.newNote.content) {
      this.http.post<{ id: number; title: string; content: string }>(this.apiUrl, this.newNote).subscribe(
        (newNote) => {
          this.notes.push(newNote); // Add the new note to the list
          this.newNote = { title: '', content: '' }; // Reset the form
        },
        (error) => {
          console.error('Error adding note:', error);
        }
      );
    }
  }

  // Delete a note by ID
  deleteNote(index: number) {
    const note = this.notes[index];
    if (note) {
      this.http.delete(`${this.apiUrl}/${note.id}`, { responseType: 'text' }).subscribe(
        () => {
          this.notes.splice(index, 1); // Update the UI
          if (this.selectedNote?.id === note.id) {
            this.selectedNote = null; // Clear the selected note if it's deleted
          }
        },
        (error) => {
          console.error('Error deleting note:', error);
        }
      );
    }
  }
  

  // Select a note to display its content
  selectNote(index: number) {
    this.selectedNote = this.notes[index];
  }
}

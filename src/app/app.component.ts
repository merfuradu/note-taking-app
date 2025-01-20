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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


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
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  notes: { id: number; title: string; content: string }[] = [];
  selectedNote: { id: number; title: string; content: string } | null = null;
  newNote = { title: '', content: '' };

  private apiUrl = 'https://notes-backend-app-5lae.onrender.com/api/notes'; 

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadNotes();
  }

loadNotes() {
  this.http.get<any[]>(this.apiUrl).subscribe(
    (data) => {
      this.notes = data;
      this.snackBar.open('Notes loaded successfully!', 'Close', { duration: 3000 });
    },
    (error) => {
      console.error('Error fetching notes:', error);
      this.snackBar.open('Failed to load notes. Please try again.', 'Close', { duration: 3000 });
    }
  );
}

addNote() {
  if (this.newNote.title && this.newNote.content) {
    this.http.post<{ id: number; title: string; content: string }>(this.apiUrl, this.newNote).subscribe(
      (newNote) => {
        this.notes.push(newNote); 
        this.newNote = { title: '', content: '' }; 
        this.snackBar.open('Note added successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error adding note:', error);
        this.snackBar.open('Failed to add note. Please try again.', 'Close', { duration: 3000 });
      }
    );
  } else {
    this.snackBar.open('Title and content are required.', 'Close', { duration: 3000 });
  }
}

saveNote() {
  if (this.selectedNote && this.selectedNote.id) {
    this.http.put(`${this.apiUrl}/${this.selectedNote.id}`, this.selectedNote).subscribe(
      () => {
        this.snackBar.open('Note updated successfully!', 'Close', { duration: 3000, panelClass: ['snackbar-success'], });
        this.loadNotes();
      },
      (error) => {
        console.error('Error updating note:', error);
        this.snackBar.open('Failed to update note. Please try again.', 'Close', { duration: 3000 });
      }
    );
  } else {
    this.snackBar.open('No note selected to update.', 'Close', { duration: 3000 });
  }
}


deleteNote(index: number) {
  const note = this.notes[index];
  if (note) {
    this.http.delete(`${this.apiUrl}/${note.id}`, { responseType: 'text' }).subscribe(
      () => {
        this.notes.splice(index, 1); 
        if (this.selectedNote?.id === note.id) {
          this.selectedNote = null; 
        }
        this.snackBar.open('Note deleted successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error deleting note:', error);
        this.snackBar.open('Failed to delete note. Please try again.', 'Close', { duration: 3000 });
      }
    );
  } else {
    this.snackBar.open('Failed to delete note. Note not found.', 'Close', { duration: 3000 });
  }
}

  selectNote(index: number) {
    this.selectedNote = this.notes[index];
  }
}

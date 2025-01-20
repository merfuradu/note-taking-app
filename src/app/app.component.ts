import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    imports: [FormsModule, CommonModule], // No HttpClientModule needed here
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'note-taking-app';
  notes: any[] = [];
  newNote = { title: '', content: '', classId: null };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.http.get<any[]>('http://localhost:3000/api/notes').subscribe((data) => {
      this.notes = data;
    });
  }

  addNote() {
    this.http.post('http://localhost:3000/api/notes', this.newNote).subscribe(() => {
      this.loadNotes();
      this.newNote = { title: '', content: '', classId: null };
    });
  }

  deleteNote(id: number) {
    this.http.delete(`http://localhost:3000/api/notes/${id}`).subscribe(() => {
      this.loadNotes();
    });
  }
}

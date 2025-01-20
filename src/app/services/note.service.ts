// src/app/services/note.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost:3000/api/notes'; // Backend URL

  constructor(private http: HttpClient) {}

  // Fetch all notes
  getNotes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Add a new note
  addNote(note: any): Observable<any> {
    return this.http.post(this.apiUrl, note);
  }

  // Delete a note
  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

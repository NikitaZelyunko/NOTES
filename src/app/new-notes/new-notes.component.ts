import { Component, OnInit } from '@angular/core';
import { NoteStorageService } from '../note-storage.service';
import { Note } from '../note';
import { notDeepStrictEqual } from 'assert';
//import {NoteComponent} from '../note/note.component';

@Component({
  selector: 'app-new-notes',
  templateUrl: './new-notes.component.html',
  styleUrls: ['./new-notes.component.css'],
  providers: [NoteStorageService]
})
export class NewNotesComponent implements OnInit {

  note: Note;
  constructor(private noteStorageService: NoteStorageService ) {
  }

  ngOnInit() {
    //this.note = new Note(0, 'My Note', 0, 0, 'HELLO');
    //this.noteStorageService.set_note(this.note);
    this.noteStorageService.remove_note(0);
    this.note = this.noteStorageService.get_note(0);
  }

}

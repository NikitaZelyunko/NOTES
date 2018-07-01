import { Component, OnInit} from '@angular/core';
import { Note } from '../note';
//import {MatCardModule} from '@angular/material/card';



@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  note: Note;
  constructor(note: Note) {
    this.note = note;
   }
  ngOnInit() {
  }

}

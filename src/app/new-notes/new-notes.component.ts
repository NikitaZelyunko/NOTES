import { Component, OnInit } from '@angular/core';
import { NoteStorageService } from '../note-storage.service';
import { NoteOrderService } from '../note-order.service';
import { Note } from '../note';
import { Router } from '@angular/router';
//import {NoteComponent} from '../note/note.component';

const NOTE_ROUTE_PREFIX = 'note';

@Component({
  selector: 'app-new-notes',
  templateUrl: './new-notes.component.html',
  styleUrls: ['./new-notes.component.css'],
  providers: [
    NoteStorageService,
    NoteOrderService
  ]
})
export class NewNotesComponent implements OnInit {

  notes: any = [];
  order: any = [];

  constructor(
    private noteStorageService: NoteStorageService,
    private noteOrderService: NoteOrderService,
    private routing: Router) {
  }

  public removeNote(note: object, notes: any[]): void {
    let last_index = this.notes.indexOf(note);
    notes.splice(last_index, 1);
    this.update_order_notes();
  }
  private update_order_notes() {
    for (let i = 0; i < this.notes.length; i++) {
      //this.notes[i].order_num = i;
      this.noteStorageService.update_or_create_note(Note.fromJSON(this.notes[i]));
    }
  }

  ngOnInit() {
    //this.noteStorageService.clear_all();
    //this.noteOrderService.clear_all();
    //this.generate_notes(10);
    this.get_new_notes();
  }
  show_note(note: object) {
    this.routing.navigate([NOTE_ROUTE_PREFIX + '/' + note['id'].toString()]);
  }
  get_new_notes() {
    let arr_id = this.noteOrderService.get_order_list(0);
    this.notes = [];
    let note;
    for (let i = 0; i < arr_id.length; i++) {
      note = this.noteStorageService.get_note(arr_id[i]).toJSON();
      if (note.note_type === 0) {
        note.order_num = i;
        this.notes[i] = note;
      }
    }
  }
  generate_notes(n: number) {
    n = Math.round(n);
    const start_symbol = 97; //a
    const max_step = 25; //97+25=122 = z
    const max_len = 255;
    let note;
    let title = '';
    let note_type = 0;
    let body_type = 0;
    let body = '';
    let color = '#FFFFFF';
    let prefix = '';
    let len = 0;

    for (let i = 0; i < n; i++) {
      prefix = i.toString();
      len = Math.round(Math.random() * max_len);
      title = prefix + this.generate_string(start_symbol, max_step, len);
      len = Math.round(Math.random() * max_len);
      body = this.generate_string(start_symbol, max_step, len);
      note = new Note(
        i,
        title,
        note_type,
        body_type,
        body,
        color);
      //console.log(note.getId());
      //console.log('after', this.noteOrderService.get_order_list(note.note_type));
      this.noteStorageService.create_note(note);
      this.noteOrderService.setToEnd(note.getId(), note.note_type);
      //console.log('before', this.noteOrderService.get_order_list(note.note_type));
    }
  }
  generate_string(start_symbol: number, max_step: number, len: number): string {
    let code_arr: Array<number> = [];
      for (let i = 0; i < len; i++) {
        code_arr.push(start_symbol + Math.round(Math.random() * max_step));
      }
      return this.from_arr_codes_to_string(code_arr);
  }
  from_arr_codes_to_string(code_arr: Array<number>): string {
    let res_str = '';
    for (let i = 0; i < code_arr.length; i++) {
      res_str += String.fromCharCode(code_arr[i]);
    }
    return res_str;
  }

private isEqualByFields(a: object, b: object) {
    let k_a = Object.keys(a);
    let k_b = Object.keys(b);
    if (k_a.length !== k_b.length) {
        return false;
    }
    for (let i = 0; i < k_a.length; i++) {
        if (k_a[i] !== k_b[i]) {
            return false;
        }
        if (a[k_a[i]] !== b[k_b[i]]) {
            return false;
        }
    }
    return true;
}
private indexOfbyFields(a: object , b: any[]) {
    //b-array
    for (let i = 0; i < b.length; i++) {
        if (this.isEqualByFields(a, b[i])) {
            return i;
        }
    }
    return -1;
}

}

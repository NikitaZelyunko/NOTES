import { Injectable } from '@angular/core';
import { Note } from './note';

@Injectable({
  providedIn: 'root'
})
export class NoteStorageService {

  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }
  get_count_notes(): number {
    return this.storage.length;
  }
  get_id_notes(count: Number): Array<string> {
    let len = this.get_count_notes();
    let res = [];
    if (len >= count) {
      for (let i = 0; i < count; i++) {
        res.push(this.storage.key(i));
      }
    }
    return res;
  }
  get_note(id: number): Note {
    const item = JSON.parse(this.storage.getItem(id.toString()));
    if (item !== null) {
      return Note.fromJSON(item);
    }
    return Note.default_instance();
  }
  set_note(note: Note): boolean {
    if ( this.storage.getItem(note.id.toString()) === null) {
      this.storage.setItem(note.id, JSON.stringify(note));
      return true;
    }
    return false;
  }
  reset_note(note: Note) {
    //console.log(note);
    this.storage.removeItem(note.id.toString());
    this.storage.setItem(note.id.toString(), JSON.stringify(note));
    for (let i = 0; i < this.storage.length; i++) {
      //console.log(this.storage.getItem(this.storage.key(i)));
    }
  }
  delete_note(id: number) {
    this.storage.removeItem(id.toString());
  }
  clear_all() {
    this.storage.clear();
  }
}

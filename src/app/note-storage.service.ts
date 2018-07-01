import { Injectable } from '@angular/core';
import { Note } from './note';


@Injectable({
  providedIn: 'root'
})
export class NoteStorageService {

  private storage;

  constructor() {
    this.storage = window.localStorage;
  }
  get_note(id: number): Note {
    const item = JSON.parse(this.storage.getItem(id));
    if (item !== null) {
      return Note.fromJSON(item['id'], item['object']);
    }
    return Note.default_instance();
  }
  set_note(note: Note): boolean {
    let item = note.toJSON();
    const id = item['id'];
    item = item['object'];
    if ( this.storage.getItem(id.toString()) === null) {
      this.storage.setItem(id, JSON.stringify(item));
      return true;
    }
    return false;
  }
  reset_note(note: Note) {
    const item = note.toJSON();
    this.storage.setItem(item['id'], JSON.stringify(item['object']));
  }
  remove_note(id: number) {
    this.storage.removeItem(id);
  }
  clear_all() {
    this.storage.clear();
  }
}

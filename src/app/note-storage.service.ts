import { Injectable, EventEmitter } from '@angular/core';
import { Note } from './note';
import { not } from '@angular/compiler/src/output/output_ast';
const PREF_KEY = 'note';

@Injectable({
  providedIn: 'root'
})
export class NoteStorageService {

  private storage: Storage;
  eventEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    this.storage = window.localStorage;
  }

  get_count_notes(): number {
    let res = 0;
    let len = this.storage.length;
    for (let i = 0; i < len; i++) {
      if (this.storage.key(i).startsWith(PREF_KEY)) {
        res++;
      }
    }
    return res;
  }
  get_id_notes(count: number): Array<string> {
    let len = this.get_count_notes();
    let res = [];
    let key = '';
    if (len >= count) {
      let n = this.storage.length;
      for (let i = 0; i < n && count >= 0; i++) {
        if (this.storage.key(i).startsWith(PREF_KEY)) {
          key = this.storage.key(i);
          res.push(key.substr(key.indexOf(PREF_KEY) + PREF_KEY.length));
          count--;
        }
      }
    }
    return res;
  }
  get_notes(id_arr: Array<number>): Array<Note> {
    let result: Array<Note> = [];
    let note: Note;
    for (let i = 0; i < id_arr.length; i++) {
      note = this.get_note(i);
      if (!note.isDefault()) {
        result.push(note);
      }
    }
    return result;
  }
  get_note(id: number): Note {
    const item = JSON.parse(this.storage.getItem(PREF_KEY + id.toString()));
    if (item !== null) {
      return Note.fromJSON(item);
    }
    return Note.default_instance();
  }
  create_note(note: Note): boolean {
    if ( this.storage.getItem(PREF_KEY + note.getId().toString()) === null) {
      this.storage.setItem(PREF_KEY + note.getId().toString(), JSON.stringify(note));
      this.eventEmitter.emit(note.getId());
      return true;
    }
    return false;
  }
  create_notes(notes: Array<Note>): Array<boolean> {
    let creates: Array<boolean> = new Array<boolean>(notes.length).fill(false);
    for (let i = 0; i < notes.length; i++) {
      if (!notes[i].isDefault()) {
        this.create_note(notes[i]);
        creates[i] = true;
      }
    }
    return creates;
  }
  create_note_auto_id(note: Note): number {
    let str_id = this.get_id_notes(this.get_count_notes());
    let int_id: Array<number> = [];
    let id = -1;
    for (let i = 0; i < str_id.length; i++) {
      int_id[i] = parseInt(str_id[i], 10);
    }
    int_id.sort((n1, n2) => n1 - n2);
    for (let i = 1; i < int_id.length; i++) {
      if (int_id[i - 1] + 1 !== int_id[i]) {
        id = int_id[i - 1] + 1;
        break;
      }
    }
    if (id === -1) {
      id = this.get_count_notes();
    }
    note = new Note(
      id,
      note.title,
      note.note_type,
      note.body_type,
      note.body,
      note.color
    );
    if (!this.create_note(note)) {
      return -1;
    }
    return id;
  }
  update_or_create_note(note: Note) {
    this.storage.removeItem(PREF_KEY + note.getId().toString());
    this.storage.setItem(PREF_KEY + note.getId().toString(), JSON.stringify(note));
  }
  update_or_create_notes(notes: Array<Note>): Array<boolean> {
    let update_or_creates: Array<boolean> = new Array<boolean>(notes.length).fill(false);
    for (let i = 0; i < notes.length; i++) {
      if (!notes[i].isDefault()) {
        this.update_or_create_note(notes[i]);
        update_or_creates[i] = true;
      }
    }
    return update_or_creates;
  }
  delete_note(id: number) {
    this.storage.removeItem(PREF_KEY + id.toString());
  }
  delete_notes(notes: Array<Note>) {
    for (let i = 0; i < notes.length; i++) {
      if (!notes[i].isDefault()) {
        this.delete_note(notes[i].getId());
      }
    }
  }
  clear_all() {
    this.storage.clear();
  }

  searchNote(search_string: string, filters: object): Array<any> {
    let n = this.get_count_notes();
    let keys = this.get_id_notes(n);
    let arr_id = [];
    let id = 0;
    for (let i = 0; i < keys.length; i++) {
      id = parseInt(keys[i], 10);
      arr_id[id] = id;
    }
    let notes = this.get_notes(arr_id);
    let template = new RegExp(search_string, 'gi');
    let matches;
    let unmatches;
    let res = [];
    for (let i = 0; i < notes.length; i++) {
      res[i] = {title: [], body: []};
      matches = notes[i].title.match(template);
      if (matches !== null) {
        res[i].title = matches;
        unmatches = notes[i].title.split(template);
        //console.log('concat', this.generate_result_string_for_search(matches, unmatches));
        //del this
        res[i].title = this.generate_result_string_for_search(matches, unmatches);
      }
      if (notes[i].body_type === 0) {
        matches = notes[i].body.match(template);
        unmatches = notes[i].body.split(template);
      }
      if (matches !== null) {
        res[i].body = matches;
        //del this
        res[i].body = this.generate_result_string_for_search(matches, unmatches);
      }
    }
    return res;
  }

  private generate_result_string_for_search(match: Array<string>, unmatch: Array<string>) {
    let res = [];
      if (unmatch[0] !== ''){
        res.push({'str': unmatch[0], 'match': false});
      }
      for (let i = 0; i < match.length; i++) {
        res.push({'str': match[i], 'match': true});
        res.push({'str': unmatch[i + 1], 'match': false});
      }
      return res;
  }
}

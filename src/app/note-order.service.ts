import { Injectable } from '@angular/core';
import { NoteStorageService } from './note-storage.service';
import { ReturnStatement } from '@angular/compiler';
import { Note } from './note';
//import { Note } from './note';
const PREF_KEY = 'order';
const COUNT_TYPES = 3;
enum note_types {NEW= 0, FIXED= 1, ARCHIVE= 2}

@Injectable({
  providedIn: 'root'
})
export class NoteOrderService {

  private storage: Storage;

  constructor(private noteStorageService: NoteStorageService) {
    this.storage = window.localStorage;
  }
  getOrder(id: number): number {
    let type = this.getType(id);
    if (type !== -1) {
      return this.findNote(id, type);
    }
    return -1;
  }
  setToEnd(id: number, type: note_types) {
    let count = this.get_order_list_count(type);
    return this.setOrder(id, type,  count);
  }
  setToBegin(id: number, type: note_types) {
    return this.setOrder(id, type, 0);
  }
  setOrder(id: number, type: note_types, order_num: number): boolean {
    let order_list = this.get_order_list(type);
    if (order_num >= 0 && order_num <= order_list.length) {
      order_list.splice(order_num, 0, id);
      this.update_order_list(order_list, type);
      return true;
    }
    return false;
  }
  changeType (id: number): boolean {
    let old_type = this.getType(id);
    let note: Note = this.noteStorageService.get_note(id);
    if (!note.isDefault()) {
    let new_type = note.note_type;
    let count = this.get_order_list_count(new_type);
    if (old_type !== new_type) {
      return this.transferNote(id, old_type, new_type, count);
    }
    }
    return false;
  }
  toNew(id: number, order_num: number): boolean {
    let old_type = this.getType(id);
    if (old_type === note_types.NEW) {
      return true;
    }
    return this.transferNote(id, old_type, note_types.NEW, order_num);
  }
  toArchive(id: number, order_num: number): boolean {
    let old_type = this.getType(id);
    if (old_type === note_types.ARCHIVE) {
      return true;
    }
    return this.transferNote(id, old_type, note_types.ARCHIVE, order_num);
  }
  toFixed(id: number, order_num: number): boolean {
    let old_type = this.getType(id);
    if (old_type === note_types.FIXED) {
      return true;
    }
    return this.transferNote(id, old_type, note_types.FIXED, order_num);
  }
  private transferNote(id: number, old_type: note_types, new_type: note_types, order_num: number): boolean {
    if (note_types[new_type] === undefined) {
      return false;
    }
    if (this.noteStorageService.get_note(id).isDefault()) {
      return false;
    }
    let old_order_num = this.findNote(id, old_type);
    let old_order_list = [];
    if (old_order_num !== -1) {
      old_order_list = this.get_order_list(old_type);
      old_order_list.splice(old_order_num, 1);
      this.update_order_list(old_order_list, old_type);
    }
    let new_order_list = this.get_order_list(new_type);
    if (order_num >= 0 && order_num <= new_order_list.length) {
      new_order_list.splice(order_num, 0, id);
      this.update_order_list(new_order_list, new_type);
      return true;
    }
    return false;

  }
  get_order_list_count(type: note_types): number {
    return this.get_order_list(type).length;
  }
  get_order_list(type: note_types): Array<number> {
    if (note_types[type] === undefined) {
      return [];
    }
    let order_list = this.storage.getItem(PREF_KEY + note_types[type]);
    if (order_list !== null) {
      return JSON.parse(order_list);
    }
    return [];
  }
  clear_all() {
    for (let i = 0; i < COUNT_TYPES; i++) {
      this.storage.removeItem(PREF_KEY + note_types[i]);
    }
  }
  private update_order_list(order_list: Array<number>, type: note_types) {
    if (note_types[type] !== undefined) {
      this.storage.setItem(PREF_KEY + note_types[type], JSON.stringify(order_list));
    }
  }
  private findNote(id: number, type: note_types): number {
    if (note_types[type] === undefined) {
      return -1;
    }
    let list_order = this.get_order_list(type);
    return list_order.indexOf(id);
  }
  private getType(id: number): note_types {
    for (let i = 0; i < COUNT_TYPES; i++) {
      if (this.findNote(id, i) !== -1) {
        return i;
    }
  }
  return -1;
  }
}

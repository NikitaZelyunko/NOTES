import { Injectable } from '@angular/core';
import { NoteStorageService } from './note-storage.service';

const PREF_KEY = 'order';
@Injectable({
  providedIn: 'root'
})
export class NoteOrderService {

  private storage: Storage;

  constructor(private noteStorageService: NoteStorageService) {
    this.storage = window.localStorage;
    console.log('order', this.storage);
  }
  get_order(id: number): number {
    return parseInt(this.storage.getItem(PREF_KEY + id.toString()), 10);
  }
  set_order (id: number, order_num: number) {
    if (this.storage.key(id)) {
      
    }
  }
}

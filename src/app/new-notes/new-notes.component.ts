import { Component, OnInit} from '@angular/core';
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

})
export class NewNotesComponent implements OnInit {

  notes: any = [];
  menu_items_visible = [];

  availible_colors = [
  '#FFFFFF', //white
  '#FF0000', //red
  '#FF8C00', //darkOrange
  '#FFFF00', //yellow
  '#008000', //green
  '#008080', //teal
  '#0000FF', //blue
  '#00008B', //darkBlue
  '#800080', //purple
  '#FF69B4', //hotPink
  '#CD853F', //peru
  '#808080'  //gray
];

  constructor(
    private noteStorageService: NoteStorageService,
    private noteOrderService: NoteOrderService,
    private routing: Router) {

  }
  ngOnInit() {
    //this.noteStorageService.clear_all();
    //this.noteOrderService.clear_all();
    //this.generate_notes(10);
    this.noteStorageService.eventEmitter.
      subscribe((id: number) => {
      let note = this.noteStorageService.get_note(id).toJSON();
      note['order_num'] = 0;
      this.notes.splice(0, 0, note);
      this.add_menu_bar(0);
    });
    this.noteOrderService.updateNew.
    subscribe((id: number) => {
    console.log(id, 'new');
    let note = this.noteStorageService.get_note(id).toJSON();
    note['order_num'] = 0;
    this.notes.splice(0, 0, note);
    this.add_menu_bar(0);
  });
    this.get_new_notes();
  }

  private init_menu_bar(order_num: number) {
    this.menu_items_visible[order_num] = {
      'changer_color_visible': false,
      'menu_bar_visible': false,
      'pin_visible': false
    };
  }
  private add_menu_bar(order_num: number) {
    this.menu_items_visible.splice(order_num, 0, {
      'changer_color_visible': false,
      'menu_bar_visible': false,
      'pin_visible': false
    });
  }
  private delete_menu_bar(order_num: number) {
    this.menu_items_visible.splice(order_num, 1);
  }

  public removeNote(note: object, notes: any[]): void {
    let last_index = this.notes.indexOf(note);
    notes.splice(last_index, 1);
    this.reorder();
    this.update_order_notes();
  }
  private reorder() {
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i]['order_num'] !== i) {
        this.noteOrderService.changeOrderNum(this.notes[i]['id'], this.notes[i]['note_type'], i);
        this.notes[i]['order_num'] = i;
      }
    }
  }
  private update_order_notes() {
    for (let i = 0; i < this.notes.length; i++) {

      this.noteStorageService.update_or_create_note(Note.fromJSON(this.notes[i]));
    }
  }
  /*
  addNote(): (id: number) => void {
    let comp = this;
    function add_note(id: number): void {
      console.log('id', id);
      let order_num = comp.noteOrderService.getOrder(id);
      let note = comp.noteStorageService.get_note(id);
      comp.notes.splice(order_num, 0, note);
    }
    return add_note;
  }
  */




  show_note(order_num: number, event: Event) {
    let class_name = event.target['className'];
    let show = false;
    switch (class_name) {
      case 'note ng-star-inserted': show = true; break;
      case 'note_header ': show = true; break;
      case 'note_body ': show = true; break;
    }
    if (show) {
      this.routing.navigate([NOTE_ROUTE_PREFIX + '/' + this.notes[order_num]['id'].toString()]);
    }
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
        this.init_menu_bar(i);
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

deleteNote(order_num: number) {
  this.notes.splice(order_num, 1);
  this.delete_menu_bar(order_num);
  this.reorder();
}

showMenuBar(order_num: number) {
  let keys = Object.keys(this.menu_items_visible[order_num]);
  keys.splice(keys.indexOf('menu_bar_visible'), 1);
  //cкрываем элементы меню которые хотим
  this.setAllValues(this.menu_items_visible[order_num], keys, false);
  this.menu_items_visible[order_num]['menu_bar_visible'] = true;
  this.menu_items_visible[order_num]['pin_visible'] = true;
}
hideMenuBar(order_num: number) {
  let keys = Object.keys(this.menu_items_visible[order_num]);
  this.setAllValues(this.menu_items_visible[order_num], keys, false);
}
showChangerColor(order_num: number) {
  let keys = Object.keys(this.menu_items_visible[order_num]);
  keys.splice(keys.indexOf('changer_color_visible'), 1);
  keys.splice(keys.indexOf('menu_bar_visible'), 1);
  this.setAllValues(this.menu_items_visible[order_num], keys, false);
  this.menu_items_visible[order_num]['changer_color_visible'] = true;
}
hideChangerColor(order_num: number) {
  this.menu_items_visible[order_num]['changer_color_visible'] = false;
}
changeColor(order_num: number, color: string) {
  this.notes[order_num]['color'] = color;
  this.commitChanges(order_num);
}
archivateUnarchivate(order_num: number) {
  if (this.notes[order_num]['note_type'] !== 2) {
    this.notes[order_num]['note_type'] = 2;
    this.commitChanges(order_num);
    this.noteOrderService.toArchive(
      this.notes[order_num]['id'],
      0
    );
  }
  else {
    this.notes[order_num]['note_type'] = 0;
    this.commitChanges(order_num);
    this.noteOrderService.toNew(
      this.notes[order_num]['id'],
      0
    );
  }
  this.deleteNote(order_num);
}
fixedUnfixed(order_num: number) {
  if (this.notes[order_num]['note_type'] !== 1) {
    this.notes[order_num]['note_type'] = 1;
    this.commitChanges(order_num);
    this.noteOrderService.toFixed(
      this.notes[order_num]['id'],
      0
    );
  }
  else {
    this.notes[order_num]['note_type'] = 0;
    this.commitChanges(order_num);
    this.noteOrderService.toNew(
      this.notes[order_num]['id'],
      0
    );
  }
  this.deleteNote(order_num);
}

trashUntrash(order_num: number) {
  if (this.notes[order_num]['note_type'] !== 3) {
    this.notes[order_num]['note_type'] = 3;
    this.commitChanges(order_num);
    this.noteOrderService.toTrash(
      this.notes[order_num]['id'],
      0
    );
  }
  else {
    this.notes[order_num]['note_type'] = 0;
    this.commitChanges(order_num);
    this.noteOrderService.toNew(
      this.notes[order_num]['id'],
      0
    );
  }
  this.deleteNote(order_num);
}

commitChanges(order_num: number) {
  this.noteStorageService.update_or_create_note(
    Note.fromJSON(this.notes[order_num]));
}

private setAllValues(obj: object, keys: Array<string>, set_value: any) {
  for (let i = 0; i < keys.length; i++) {
    obj[keys[i]] = set_value;
  }
}

}

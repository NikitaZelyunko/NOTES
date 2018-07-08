import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { NoteStorageService } from '../note-storage.service';
import { NoteOrderService } from '../note-order.service';
import { Note } from '../note';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.css']
})
export class NoteAddComponent implements OnInit {
  selected = false;
  first_show = true;
  note: Note = Note.default_instance();
  note_items_visible = {
    'default_note_header': false,
    'default_note_body' : false
  };
  menu_items_visible = {
    'changer_color_visible': false,
    'menu_bar_visible': true,
  };
  changer_color_visible = false;
  menu_bar_visible = false;
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
    private route: Router) {
  }
  ngOnInit() {
    if (this.note.title === '') {
      this.note_items_visible['default_note_header'] = true;
    }
    if (this.note.body === '') {
      this.note_items_visible['default_note_body'] = true;
    }
    document.addEventListener('click', this.hideNote(this));
    this.note = Note.default_instance();
  }

  hideNote(component: NoteAddComponent): (event: Event) => void {
    let comp = component;
    function showNote (event: Event): void {
      if (comp.selected) {
        let target: EventTarget = event.target;
        for (; ;) {
          target = target['parentElement'];
          if (target === null) {
            comp.selected = false;
            comp.ngOnInit();
            comp.first_show = true;
            return;
          }
          if (target['id'] === 'creates_note') {
            comp.selected = true;
            comp.first_show = false;
            return;
          }
        }
      }
    }
    return showNote;
  }
  focusNoteBody() {
    if (this.first_show) {
      let body_field: HTMLElement = document.getElementById('note_body_1');
      body_field.focus();
      this.first_show = false;
    }

  }
  /*
  showDefaultNoteHeader() {
    if (this.note.title === '') {
      this.note_items_visible['default_note_header'] = true;
    }
  }
  hideDefaultNoteHeader() {
    this.note_items_visible['default_note_header'] = false;
    document.getElementById('note_header_1').focus();
  }
  showDefaultNoteBody() {
    if (this.note.body === '') {
      this.note_items_visible['default_note_body'] = true;
    }
  }
  hideDefaultNoteBody() {
    this.note_items_visible['default_note_body'] = false;
    document.getElementById('note_body_1').focus();
  }
  */
  showMenuBar() {
    let keys = Object.keys(this.menu_items_visible);
    keys.splice(keys.indexOf('menu_bar_visible'), 1);
    //cкрываем элементы меню которые хотим
    this.setAllValues(this.menu_items_visible, keys, false);
    this.menu_items_visible['menu_bar_visible'] = true;
  }
  hideMenuBar() {
    this.menu_items_visible['menu_bar_visible'] = false;
  }
  showChangerColor() {
    let keys = Object.keys(this.menu_items_visible);
    keys.splice(keys.indexOf('changer_color_visible'), 1);
    keys.splice(keys.indexOf('menu_bar_visible'), 1);
    this.setAllValues(this.menu_items_visible, keys, false);
    this.menu_items_visible['changer_color_visible'] = true;
  }
  hideChangerColor() {
    this.menu_items_visible['changer_color_visible'] = false;
  }
  changeColor( color: string) {
    this.note.color = color;
  }
  archivateUnarchivate() {
    if (this.note.isArchive()) {
      this.note.toNew();
    }
    this.note.toArchive();
  }
  fixedUnfixed() {
    if (this.note.isFixed()) {
      this.note.toNew();
    }
    this.note.toFixed();
  }
  commitChanges() {
    this.note.title = document.getElementsByClassName('note_header')[0]['value'];
    this.note.body = document.getElementsByClassName('note_body')[0]['value'];
    this.note.title = this.deleteEndEnters(this.note.title);
    this.note.body = this.deleteEndEnters(this.note.body);
    this.noteStorageService.eventEmitter.subscribe((value) => console.log('add', value));
    let id = this.noteStorageService.create_note_auto_id(this.note);
    this.noteOrderService.setToBegin(id, this.note.note_type);
    this.selected = false;
    this.ngOnInit();
  }

  private setAllValues(obj: object, keys: Array<string>, set_value: any) {
    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = set_value;
    }
  }
  private deleteEndEnters(str: string): string {
    let arr_str = str.split('\n');
    let last_not_empty = arr_str.length - 1;
    for (let i = arr_str.length - 1 ; i >= 0; i--) {
      if (arr_str[i] !== '') {
        last_not_empty = i + 1;
        break;
      }
    }
    arr_str.splice(last_not_empty, arr_str.length - last_not_empty);
    return arr_str.join('\n');
  }
}

import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Note } from '../note';

import {NoteStorageService} from '../note-storage.service';
import { NoteOrderService } from '../note-order.service';
import { consumeBinding } from '@angular/core/src/render3/instructions';
//import {MatCardModule} from '@angular/material/card';



@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  rows_count = 10;
  enter_key_up: KeyboardEvent = new KeyboardEvent(
    'keyup',
    {
      'code': 'Enter',
      'key': 'Enter',
      'location': 0,
      'repeat': false}
    );
  show_note: Note;
  commit_changes_note: Note;
  note: Note;
  text_changes_note: Note;
  par_header: HTMLParagraphElement;
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
    private route: ActivatedRoute,
    private location: Location) {
  }
  ngOnInit() {
    this.getNote();
    if (this.show_note.title === '') {
      this.note_items_visible['default_note_header'] = true;
    }
    if (this.show_note.body === '') {
      this.note_items_visible['default_note_body'] = true;
    }
  }
  getNote(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.show_note = this.noteStorageService.get_note(id);
    this.commit_changes_note = Note.copyNote(this.show_note);
  }
  /*
  showDefaultNoteHeader() {
    if (this.show_note.title === '') {
      this.note_items_visible['default_note_header'] = true;
    }
  }
  hideDefaultNoteHeader() {
    this.note_items_visible['default_note_header'] = false;
    document.getElementById('note_header_1').focus();
  }
  showDefaultNoteBody() {
    if (this.show_note.body === '') {
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
    this.show_note.color = color;
    this.commit_changes_note.color = color;
  }
  archivateUnarchivate() {
    if (this.commit_changes_note.isArchive()) {
      this.commit_changes_note.toNew();
    }
    this.commit_changes_note.toArchive();
  }
  fixedUnfixed() {
    if (this.note.isFixed()) {
      this.note.toNew();
    }
    this.note.toFixed();
  }
  commitChanges() {
    this.commit_changes_note.title = document.getElementsByClassName('note_header')[0]['value'];
    this.commit_changes_note.body = document.getElementsByClassName('note_body')[0]['value'];
    this.commit_changes_note.title = this.deleteEndEnters(this.commit_changes_note.title);
    this.commit_changes_note.body = this.deleteEndEnters(this.commit_changes_note.body);
    this.noteStorageService.update_or_create_note(this.commit_changes_note);
    this.noteOrderService.changeType(this.commit_changes_note.getId());
    this.location.back();
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

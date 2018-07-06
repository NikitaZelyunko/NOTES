import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Note } from '../note';

import {NoteStorageService} from '../note-storage.service';
//import {MatCardModule} from '@angular/material/card';



@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
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
  menu_items_visible = {
    'changer_color_visible': false,
    'menu_bar_visible': true
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
    private route: ActivatedRoute,
    private location: Location) {
  }
  ngOnInit() {
    this.getNote();
  }
  changeTitle() {
    console.log('hello');
  }
  keyUpEnter(event: KeyboardEvent, field: string) {
    if ( event.type === 'keyup') {
      if (event.key === 'Enter') {
        //console.log(this.show_note[field]);
        //console.log(event.currentTarget['innerText']);
        //this.commit_changes_note[field] = event.currentTarget['innerText'];
      }
    }
  }
  getNote(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.show_note = this.noteStorageService.get_note(id);
    this.commit_changes_note = Note.copyNote(this.show_note);
    console.log('From base', this.show_note);
  }
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
    //console.log(document.getElementsByClassName('note_header')[0]);
    let str = document.getElementsByClassName('note_header')[0]['innerText'];
    console.log('innerText');
    for ( let i = 0; i < str.length; i++) {
      console.log(str[i].charCodeAt(0));
    }
    this.commit_changes_note.title = document.getElementsByClassName('note_header')[0]['innerText'];
    this.commit_changes_note.body = document.getElementsByClassName('note_body')[0]['innerText'];
    //console.log('before');
    //console.log(this.commit_changes_note.title);
    //console.log(this.commit_changes_note.body);
    //document.getElementsByClassName('note_header')[0].dispatchEvent(this.enter_key_up);
    //document.getElementsByClassName('note_body')[0].dispatchEvent(this.enter_key_up);
    this.commit_changes_note.title = this.deleteEndEnters(this.commit_changes_note.title);
    this.commit_changes_note.body = this.deleteEndEnters(this.commit_changes_note.body);
    //console.log('after');
    //console.log(this.commit_changes_note.title);
    //console.log(this.commit_changes_note.body);
    this.noteStorageService.reset_note(this.commit_changes_note);
    //this.location.back();
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
